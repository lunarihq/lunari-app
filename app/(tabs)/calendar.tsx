import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, TouchableOpacity, Text } from 'react-native';
import Colors from '../styles/colors';
import { PanGestureHandler, State, GestureHandlerRootView, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { DateData } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import { db, getSetting } from '../../db';
import { periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { BaseCalendar } from '../../components/BaseCalendar';
import { CycleDetails } from '../../components/CycleDetails';
import { MarkedDates, formatDateString } from '../types/calendarTypes';

// Export a function to navigate to the period calendar screen
export function openPeriodModal() {
  router.push('/period-calendar');
}

export default function CalendarScreen() {
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [baseMarkedDates, setBaseMarkedDates] = useState<MarkedDates>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [allPeriodDates, setAllPeriodDates] = useState<string[]>([]);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);
  const [userCycleLength, setUserCycleLength] = useState<number>(28);
  const [userPeriodLength, setUserPeriodLength] = useState<number>(5);
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));
  const [currentDate] = useState(formatDateString(new Date()));
  const [currentMonth, setCurrentMonth] = useState('');
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [displayedMonth, setDisplayedMonth] = useState(formatDateString(new Date()));
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const gestureRef = useRef(null);
  const gestureY = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(280)).current;
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const cycleLength = await getSetting('userCycleLength');
        if (cycleLength) {
          setUserCycleLength(parseInt(cycleLength, 10));
        }

        const periodLength = await getSetting('userPeriodLength');
        if (periodLength) {
          setUserPeriodLength(parseInt(periodLength, 10));
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    loadUserSettings();
  }, []);
  
  // Check if we should navigate to the period calendar screen from URL params
  useEffect(() => {
    if (params.openPeriodModal === 'true') {
      router.push('/period-calendar');
    }
  }, [params.openPeriodModal]);
  
  // Load period dates from database
  const loadData = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: MarkedDates, curr) => { 
      acc[curr.date] = { 
        selected: true, 
        customStyles: { 
          container: { 
            backgroundColor: Colors.periodPink,
            borderRadius: 16,
          },
          text: {
            color: Colors.white
          }
        } 
      };
      return acc;
    }, {} as MarkedDates);
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      const sortedDates = saved.map(s => s.date);
      setAllPeriodDates(sortedDates);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
      
      setFirstPeriodDate(mostRecentStart);
      
      // Generate predictions and marked dates
      generateMarkedDates(dates, mostRecentStart, periods);
    } else {
      setFirstPeriodDate(null);
      setAllPeriodDates([]);
      setCycleDay(null);
      setMarkedDates({});
    }
  };

  // Generate all marked dates including predictions
  const generateMarkedDates = (periodDates: MarkedDates, startDate: string, allPeriods: string[][]) => {
    if (!startDate) return;
    
    const allMarkedDates = { ...periodDates };
    const cycleLength = PeriodPredictionService.getAverageCycleLength(Object.keys(periodDates), userCycleLength);
    setAverageCycleLength(cycleLength);
    
    // Get all period start dates (earliest date in each period)
    const periodStartDates = allPeriods.map(period => period[period.length - 1]);
    
    // Generate fertile windows and ovulation for all logged periods (past and present)
    const fertilityDates = PeriodPredictionService.generateFertilityForLoggedPeriods(periodStartDates, cycleLength);
    
    // Get predicted dates for future cycles
    const predictedDates = PeriodPredictionService.generatePredictedDates(startDate, cycleLength, userPeriodLength, 12);
    
    // Apply styling to fertility dates (past and present cycles)
    Object.entries(fertilityDates).forEach(([dateString, prediction]) => {
      // Only apply fertility style if this is not an actual period date
      if (!allMarkedDates[dateString] || !allMarkedDates[dateString].selected) {
        if (prediction.type === 'ovulation') {
          // Ovulation day: Blue outline circle on light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: Colors.fertileBlueBg,
                borderWidth: 2,
                borderColor: Colors.fertileBlue,
              },
              text: {
                color: Colors.fertileBlue
              }
            }
          };
        } else if (prediction.type === 'fertile') {
          // Fertile window days: Light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: Colors.fertileBlueBg,
              },
              text: {
                color: Colors.fertileBlue
              }
            }
          };
        }
      }
    });
    
    // Apply styling to predicted dates (future cycles only)
    Object.entries(predictedDates).forEach(([dateString, prediction]) => {
      // Only apply prediction style if this is not an actual period date and not already a fertility date
      if (!allMarkedDates[dateString] || !allMarkedDates[dateString].selected) {
        if (prediction.type === 'ovulation') {
          // Ovulation day: Blue outline circle on light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: Colors.fertileBlueBg,
                borderWidth: 2,
                borderColor: Colors.fertileBlue,
              },
              text: {
                color: Colors.fertileBlue
              }
            }
          };
        } else if (prediction.type === 'fertile') {
          // Fertile window days: Light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: Colors.fertileBlueBg,
              },
              text: {
                color: Colors.fertileBlue
              }
            }
          };
        } else if (prediction.type === 'period') {
          // Light pink styling for predicted period days
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: Colors.periodPinkVeryLight,
              },
              text: {
                color: Colors.periodPink
              }
            }
          };
        }
      }
    });
    
    // Store base marked dates (without selection highlight)
    setBaseMarkedDates(allMarkedDates);
  };

  // Calculate cycle day for a given date
  const calculateCycleDay = (date: string): number | null => {
    if (!firstPeriodDate || allPeriodDates.length === 0) return null;
    
    const selectedDateObj = new Date(date);
    const startDateObj = new Date(firstPeriodDate);
    
    // If the selected date is in the current cycle or future, use the current cycle start
    if (selectedDateObj >= startDateObj) {
      const cycleInfo = PeriodPredictionService.getCycleInfo(firstPeriodDate, date);
      return cycleInfo.cycleDay;
    }
    
    // For dates before the current cycle, find the appropriate cycle start date
    const periods = PeriodPredictionService.groupDateIntoPeriods(allPeriodDates);
    const cycleLength = PeriodPredictionService.getAverageCycleLength(allPeriodDates, userCycleLength);
    
    // Find which cycle contains the target date
    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      const periodStart = period[period.length - 1]; // Earliest date in the period
      const periodEnd = period[0]; // Latest date in the period
      
      // If target date is within this period, calculate cycle day from this period start
      if (date >= periodStart && date <= periodEnd) {
        const cycleInfo = PeriodPredictionService.getCycleInfo(periodStart, date);
        return cycleInfo.cycleDay;
      }
      
      // If target date is before this period, check if it's in the previous cycle
      if (date < periodStart) {
        // Calculate the previous cycle start date
        const prevCycleStart = new Date(periodStart);
        prevCycleStart.setDate(prevCycleStart.getDate() - cycleLength);
        const prevCycleStartStr = formatDateString(prevCycleStart);
        
        // If target date is after the previous cycle start, it's in that cycle
        if (date >= prevCycleStartStr) {
          const cycleInfo = PeriodPredictionService.getCycleInfo(prevCycleStartStr, date);
          return cycleInfo.cycleDay;
        }
      }
    }
    
    return null;
  };

  // Update cycle day info for selected date
  const updateSelectedDateInfo = (date: string) => {
    setCycleDay(calculateCycleDay(date));
  };

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = useCallback((selectedDateParam: string) => {
    const updatedMarkedDates = { ...baseMarkedDates };
    const isPeriodDate = updatedMarkedDates[selectedDateParam]?.customStyles?.container?.backgroundColor === Colors.periodPink;
    
    if (isPeriodDate) {
      // For period dates, preserve the pink background but add a grey background behind it
      updatedMarkedDates[selectedDateParam] = {
        ...updatedMarkedDates[selectedDateParam],
        customStyles: {
          ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
          container: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles?.container || {}),
            backgroundColor: Colors.periodPink,
            borderRadius: 16, // Keep the original size for the pink circle
            width: 32, // Keep the original size for the pink circle
            height: 32, // Keep the original size for the pink circle
          },
          text: { color: Colors.white }
        },
        // Add a custom container style for the grey background behind
        customContainerStyle: {
          backgroundColor: Colors.calendarNeutral,
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }
      };
    } else {
      // For non-period dates, just add the grey background
      updatedMarkedDates[selectedDateParam] = {
        ...updatedMarkedDates[selectedDateParam],
        customStyles: {
          ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
          container: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles?.container || {}),
            backgroundColor: Colors.calendarNeutralLight,
            borderRadius: 20, // Bigger circle
            width: 40, // Make it bigger
            height: 40, // Make it bigger
          },
          text: updatedMarkedDates[selectedDateParam]?.customStyles?.text
        }
      };
    }
    
    return updatedMarkedDates;
  }, [baseMarkedDates]);

  const selectionMarkedDates = useMemo(() => (
    selectedDate ? getMarkedDatesWithSelection(selectedDate) : baseMarkedDates
  ), [baseMarkedDates, selectedDate, getMarkedDatesWithSelection]);

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      const reloadData = async () => {
        await loadData();
        // Reset to current date whenever tab is focused
        const today = formatDateString(new Date());
        if (selectedDate !== today) {
          setSelectedDate(today);
        }
        // Do not force re-render or change displayedMonth here to avoid blink and header desync
        
        // Reset button position immediately if drawer is open
        if (isDrawerOpen) {
          const isDateInPastOrToday = today <= currentDate;
          const buttonPosition = isDateInPastOrToday ? 255 : 100;
          buttonAnimation.setValue(buttonPosition);
        }
      };
      reloadData();
      return () => {};
    }, [isDrawerOpen, currentDate, selectedDate])
  );

  // Initial load
  useEffect(() => {
    loadData();
    updateSelectedDateInfo(selectedDate);
    
    // Set initial month display
    const date = new Date(selectedDate);
    setCurrentMonth(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
    setDisplayedMonth(selectedDate);
  }, []);
  
  // Update cycle info when selected date changes
  useEffect(() => {
    updateSelectedDateInfo(selectedDate);
  }, [selectedDate, firstPeriodDate, allPeriodDates]);

  // Update marked dates when base marked dates change (but not when selected date changes - handled in onDayPress)
  useEffect(() => {
    setMarkedDates(selectionMarkedDates);
  }, [selectionMarkedDates]);

  // Update header with Today button based on current month
  useEffect(() => {
    navigation.setOptions({
      headerRight: isTodayButtonVisible() ? () => (
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      ) : undefined,
    });
  }, [displayedMonth, navigation]);

  // Handle saving period dates
  const savePeriodDates = async (dates: MarkedDates) => {
    try {
      await db.delete(periodDates);
      
      const dateInserts = Object.keys(dates).map(date => ({
        date
      }));
      
      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
      }
      
      loadData(); // Reload data after saving
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const openDrawer = (dateToUse?: string) => {
    setIsDrawerOpen(true);
    
    // Use provided date or fall back to current selectedDate
    const dateForComparison = dateToUse || selectedDate;
    const isDateInPastOrToday = dateForComparison <= currentDate;
    const buttonPosition = isDateInPastOrToday ? 255 : 100;
    
    Animated.parallel([
      Animated.spring(drawerAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.spring(buttonAnimation, {
        toValue: buttonPosition,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      })
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.spring(drawerAnimation, {
        toValue: 400,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.spring(buttonAnimation, {
        toValue: 20,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      })
    ]).start(() => {
      setIsDrawerOpen(false);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: gestureY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Close if dragged down enough or swiped down quickly
      if (translationY > 100 || velocityY > 500) {
        closeDrawer();
      } else {
        // Snap back to open position
        openDrawer();
      }
      
      // Reset gesture value
      gestureY.setValue(0);
    }
  };

  const onDayPress = useCallback((day: DateData) => {
    const newDate = day.dateString;
    setSelectedDate(newDate);
    
    // Update cycle day and marked dates immediately to avoid delays
    setCycleDay(calculateCycleDay(newDate));
    setMarkedDates(getMarkedDatesWithSelection(newDate));
    
    openDrawer(newDate);
  }, [calculateCycleDay, getMarkedDatesWithSelection, openDrawer]);

  const onMonthChange = useCallback((month: DateData) => {
    setCurrentMonth(`${new Date(month.dateString).toLocaleString('default', { month: 'long' })} ${new Date(month.dateString).getFullYear()}`);
    setDisplayedMonth(month.dateString);
  }, []);

  // Function to check if the current displayed month is different from today's month
  const isTodayButtonVisible = () => {
    // Extract year and month from today string (YYYY-MM-DD)
    const todayYear = currentDate.substring(0, 4);
    const todayMonth = currentDate.substring(5, 7);
    
    // Extract year and month from displayedMonth string (YYYY-MM-DD)
    const currentYear = displayedMonth.substring(0, 4);
    const currentMonth_ = displayedMonth.substring(5, 7);
    
    // Return true if they are different (button should be visible)
    return todayYear !== currentYear || todayMonth !== currentMonth_;
  };

  const goToToday = useCallback(() => {
    const today = formatDateString(new Date());
    setSelectedDate(today);
    setDisplayedMonth(today);
    setCalendarKey(Date.now()); // Force calendar to reposition to today without remounting BaseCalendar
    updateSelectedDateInfo(today);
    setMarkedDates(getMarkedDatesWithSelection(today));
  }, [getMarkedDatesWithSelection]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.calendarContainer}>
          <BaseCalendar
            mode="view"
            calendarKey={calendarKey}
            current={selectedDate}
            markedDates={markedDates}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            hideDayNames={true}
            calendarHeight={518}
          />
        </View>
        
        {/* Floating Action Button */}
        <Animated.View 
          style={[
            styles.floatingButton,
            {
              bottom: buttonAnimation
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => router.push('/period-calendar')}
            activeOpacity={0.8}
            style={styles.floatingButtonTouchable}
          >
            <Text style={styles.floatingButtonText}>Edit period dates</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {isDrawerOpen && (
          <PanGestureHandler
            ref={gestureRef}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View 
              style={[
                styles.bottomDrawer,
                {
                  transform: [{
                    translateY: Animated.add(drawerAnimation, gestureY).interpolate({
                      inputRange: [0, 400],
                      outputRange: [0, 400],
                      extrapolate: 'clamp'
                    })
                  }]
                }
              ]}
            >

              <CycleDetails 
                selectedDate={selectedDate}
                cycleDay={cycleDay}
                averageCycleLength={averageCycleLength}
                onClose={closeDrawer}
              />
            </Animated.View>
          </PanGestureHandler>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.fertileBlue,
    marginRight: 16,
  },
  calendarContainer: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999,
  },
  floatingButtonTouchable: {
    backgroundColor: Colors.fertileBlue,
    borderRadius: 80,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },

});
