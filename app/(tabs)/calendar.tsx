import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
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
            backgroundColor: '#FF597B',
            borderRadius: 16,
          },
          text: {
            color: '#FFFFFF'  // Make text white for period days
          }
        } 
      };
      return acc;
    }, {} as MarkedDates);
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      const sortedDates = saved.map(s => s.date);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
      
      setFirstPeriodDate(mostRecentStart);
      
      // Generate predictions and marked dates
      generateMarkedDates(dates, mostRecentStart);
    } else {
      setFirstPeriodDate(null);
      setCycleDay(null);
      setMarkedDates({});
    }
  };

  // Generate all marked dates including predictions
  const generateMarkedDates = (periodDates: MarkedDates, startDate: string) => {
    if (!startDate) return;
    
    const allMarkedDates = { ...periodDates };
    const cycleLength = PeriodPredictionService.getAverageCycleLength(Object.keys(periodDates), userCycleLength);
    setAverageCycleLength(cycleLength);
    
    // Get predicted dates from the service
    const predictedDates = PeriodPredictionService.generatePredictedDates(startDate, cycleLength, userPeriodLength, 12);
    
    // Apply styling to predicted dates
    Object.entries(predictedDates).forEach(([dateString, prediction]) => {
      // Only apply prediction style if this is not an actual period date
      if (!allMarkedDates[dateString] || !allMarkedDates[dateString].selected) {
        if (prediction.type === 'ovulation') {
          // Ovulation day: Blue outline circle on light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: '#E7F3FF', // Light blue background
                borderWidth: 2,
                borderColor: '#4F5FEB', // Blue outline
              },
              text: {
                color: '#4F5FEB'
              }
            }
          };
        } else if (prediction.type === 'fertile') {
          // Fertile window days: Light blue background
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: '#E7F3FF',
              },
              text: {
                color: '#4F5FEB'
              }
            }
          };
        } else if (prediction.type === 'period') {
          // Light pink styling for predicted period days
          allMarkedDates[dateString] = {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: '#FFE7EC',
              },
              text: {
                color: '#FF597B'
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
    if (!firstPeriodDate) return null;
    
    const selectedDateObj = new Date(date);
    const startDateObj = new Date(firstPeriodDate);
    
    if (selectedDateObj >= startDateObj) {
      const cycleInfo = PeriodPredictionService.getCycleInfo(firstPeriodDate, date);
      return cycleInfo.cycleDay;
    }
    return null;
  };

  // Update cycle day info for selected date
  const updateSelectedDateInfo = (date: string) => {
    setCycleDay(calculateCycleDay(date));
  };

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = (selectedDate: string) => {
    const updatedMarkedDates = { ...baseMarkedDates };
    const isPeriodDate = updatedMarkedDates[selectedDate]?.customStyles?.container?.backgroundColor === '#FF597B';
    
    if (isPeriodDate) {
      // For period dates, preserve the pink background but add a grey background behind it
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        customStyles: {
          ...(updatedMarkedDates[selectedDate]?.customStyles || {}),
          container: {
            ...(updatedMarkedDates[selectedDate]?.customStyles?.container || {}),
            backgroundColor: '#FF597B', // Keep the pink background
            borderRadius: 16, // Keep the original size for the pink circle
            width: 32, // Keep the original size for the pink circle
            height: 32, // Keep the original size for the pink circle
          },
          text: { color: '#FFFFFF' }
        },
        // Add a custom container style for the grey background behind
        customContainerStyle: {
          backgroundColor: '#E5E5E5',
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }
      };
    } else {
      // For non-period dates, just add the grey background
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        customStyles: {
          ...(updatedMarkedDates[selectedDate]?.customStyles || {}),
          container: {
            ...(updatedMarkedDates[selectedDate]?.customStyles?.container || {}),
            backgroundColor: '#E6E6E6', // Grey background like Flo
            borderRadius: 20, // Bigger circle
            width: 40, // Make it bigger
            height: 40, // Make it bigger
          },
          text: updatedMarkedDates[selectedDate]?.customStyles?.text
        }
      };
    }
    
    return updatedMarkedDates;
  };

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      const reloadData = async () => {
        await loadData();
        // Reset to current date whenever tab is focused
        const today = formatDateString(new Date());
        setSelectedDate(today);
        setDisplayedMonth(today);
        setCalendarKey(Date.now()); // Force calendar re-render
        
        // Reset button position immediately if drawer is open
        if (isDrawerOpen) {
          const isDateInPastOrToday = today <= currentDate;
          const buttonPosition = isDateInPastOrToday ? 255 : 100;
          buttonAnimation.setValue(buttonPosition);
        }
      };
      reloadData();
      return () => {};
    }, [isDrawerOpen, currentDate])
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
  }, [selectedDate, firstPeriodDate]);

  // Update marked dates when base marked dates change (but not when selected date changes - handled in onDayPress)
  useEffect(() => {
    if (selectedDate) {
      setMarkedDates(getMarkedDatesWithSelection(selectedDate));
    }
  }, [baseMarkedDates]);

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

  const onHandlerStateChange = (event: any) => {
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

  const onDayPress = (day: DateData) => {
    const newDate = day.dateString;
    setSelectedDate(newDate);
    
    // Update cycle day and marked dates immediately to avoid delays
    setCycleDay(calculateCycleDay(newDate));
    setMarkedDates(getMarkedDatesWithSelection(newDate));
    
    openDrawer(newDate);
  };

  const onMonthChange = (month: DateData) => {
    setCurrentMonth(`${new Date(month.dateString).toLocaleString('default', { month: 'long' })} ${new Date(month.dateString).getFullYear()}`);
    setDisplayedMonth(month.dateString);
  };

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

  const goToToday = () => {
    const today = formatDateString(new Date());
    setSelectedDate(today);
    setDisplayedMonth(today);
    setCalendarKey(Date.now()); // Force calendar re-render
    updateSelectedDateInfo(today);
    setMarkedDates(getMarkedDatesWithSelection(today));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.calendarContainer}>
          <BaseCalendar
            mode="view"
            key={calendarKey}
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
    backgroundColor: '#ffffff',
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F5FEB',
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
    backgroundColor: '#4F5FEB',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
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
