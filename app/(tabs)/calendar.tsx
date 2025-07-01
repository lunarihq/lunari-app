import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import { db } from '../../db';
import { periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { BaseCalendar } from '../components/BaseCalendar';
import { CycleDetails } from '../components/CycleDetails';
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
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));
  const [currentDate] = useState(formatDateString(new Date()));
  const [currentMonth, setCurrentMonth] = useState('');
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const gestureRef = useRef(null);
  const gestureY = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(280)).current;
  const params = useLocalSearchParams();
  
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
      // Sort dates in descending order for grouping
      const sortedDates = saved.map(s => s.date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      const periods: string[][] = [];
      let currentPeriod: string[] = [sortedDates[0]];

      for (let i = 1; i < sortedDates.length; i++) {
        const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 7) {
          currentPeriod.push(sortedDates[i]);
        } else {
          periods.push(currentPeriod);
          currentPeriod = [sortedDates[i]];
        }
      }
      periods.push(currentPeriod);

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
    const cycleLength = PeriodPredictionService.getAverageCycleLength(Object.keys(periodDates));
    
    // Generate predictions for the next 3 months
    for (let i = 0; i < 3; i++) {
      // Create date from startDate, ensuring we use a consistent date format
      const startDateParts = startDate.split('-');
      const year = parseInt(startDateParts[0]);
      const month = parseInt(startDateParts[1]) - 1; // JS months are 0-indexed
      const day = parseInt(startDateParts[2]);
      
      // Create a new date at noon to avoid timezone issues
      const nextPeriodDate = new Date(year, month, day + cycleLength * (i + 1), 12, 0, 0);
      const nextPeriodDateString = formatDateString(nextPeriodDate);
      
      // Mark 5 days of predicted period
      for (let j = 0; j < 5; j++) {
        const predictedDay = new Date(nextPeriodDate);
        predictedDay.setDate(predictedDay.getDate() + j);
        const predictedDayString = formatDateString(predictedDay);
        
        // Only apply prediction style if this is not an actual period date
        if (!allMarkedDates[predictedDayString] || !allMarkedDates[predictedDayString].selected) {
          allMarkedDates[predictedDayString] = {
            customStyles: {
              container: {
                borderWidth: 1.5,
                borderRadius: 16,
                borderStyle: 'dashed',
                borderColor: '#FF597B',
                backgroundColor: 'transparent',
              },
              text: {
                color: '#FF597B'
              }
            }
          };
        }
      }
    }
    
    // Mark today with a gray background, but preserve period styling if it's a period day
    if (allMarkedDates[currentDate] && allMarkedDates[currentDate].selected) {
      // This is both today and a period day - keep period background but add border
      allMarkedDates[currentDate] = {
        ...allMarkedDates[currentDate],
        customStyles: {
          ...allMarkedDates[currentDate].customStyles,
          container: {
            ...allMarkedDates[currentDate].customStyles?.container,
            borderWidth: 2,
            borderColor: 'black',
          },
          // Ensure text is white for period days
          text: {
            color: '#FFFFFF'
          }
        }
      };
    } else {
      // This is just today, not a period day
      allMarkedDates[currentDate] = {
        ...allMarkedDates[currentDate],
        customStyles: {
          ...(allMarkedDates[currentDate]?.customStyles || {}),
          container: {
            ...(allMarkedDates[currentDate]?.customStyles?.container || {}),
            backgroundColor: allMarkedDates[currentDate]?.customStyles?.container?.backgroundColor || '#E6E6E6',
            borderRadius: 16,
          }
        }
      };
    }
    
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
    
    updatedMarkedDates[selectedDate] = {
      ...updatedMarkedDates[selectedDate],
      customStyles: {
        ...(updatedMarkedDates[selectedDate]?.customStyles || {}),
        container: {
          ...(updatedMarkedDates[selectedDate]?.customStyles?.container || {}),
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 16,
        },
        text: isPeriodDate 
          ? { color: '#FFFFFF' } 
          : updatedMarkedDates[selectedDate]?.customStyles?.text
      }
    };
    
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
        setCalendarKey(Date.now()); // Force calendar re-render
      };
      reloadData();
      return () => {};
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadData();
    updateSelectedDateInfo(selectedDate);
    
    // Set initial month display
    const date = new Date(selectedDate);
    setCurrentMonth(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
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

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.parallel([
      Animated.spring(drawerAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.spring(buttonAnimation, {
        toValue: 280,
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
    
    openDrawer();
  };

  const onMonthChange = (month: DateData) => {
    setCurrentMonth(`${new Date(month.dateString).toLocaleString('default', { month: 'long' })} ${new Date(month.dateString).getFullYear()}`);
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
            calendarHeight={410}
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
              <View style={styles.drawerHandleContainer}>
                <View style={styles.drawerHandle} />
              </View>
              <CycleDetails 
                selectedDate={selectedDate}
                cycleDay={cycleDay}
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
  calendarContainer: {
    flex: 1,
    paddingTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999,
  },
  floatingButtonTouchable: {
    backgroundColor: '#FF597B',
    borderRadius: 80,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  drawerHandleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
});
