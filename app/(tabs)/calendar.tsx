import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../db';
import { periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { Ionicons } from '@expo/vector-icons';
import { PeriodCalendarModal } from '../../components/PeriodCalendar';

export default function CalendarScreen() {
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const params = useLocalSearchParams();
  
  // Check if we should open the period modal from URL params
  useEffect(() => {
    if (params.openPeriodModal === 'true') {
      setModalVisible(true);
    }
  }, [params.openPeriodModal]);
  
  // Load period dates from database
  const loadData = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: { [key: string]: any }, curr) => { 
      acc[curr.date] = { selected: true, customStyles: { container: { backgroundColor: '#FF597B', borderRadius: 0 } } };
      return acc;
    }, {} as { [key: string]: any });
    
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
  const generateMarkedDates = (periodDates: { [date: string]: any }, startDate: string) => {
    if (!startDate) return;
    
    const allMarkedDates = { ...periodDates };
    const cycleLength = PeriodPredictionService.getAverageCycleLength(Object.keys(periodDates));
    
    // Generate predictions for the next 3 months
    for (let i = 0; i < 3; i++) {
      const nextPeriodDate = new Date(startDate);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength * (i + 1));
      
      // Mark 5 days of predicted period
      for (let j = 0; j < 5; j++) {
        const predictedDay = new Date(nextPeriodDate);
        predictedDay.setDate(predictedDay.getDate() + j);
        const predictedDayString = predictedDay.toISOString().split('T')[0];
        
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
      
      // Calculate fertility window
      const fertilityWindow = PeriodPredictionService.getFertilityWindow(
        nextPeriodDate.toISOString().split('T')[0],
        cycleLength
      );
      
      // Mark fertility window
      const startFertility = new Date(fertilityWindow.start);
      const endFertility = new Date(fertilityWindow.end);
      
      for (let date = new Date(startFertility); date <= endFertility; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        
        // Skip if it's already a period day
        if (allMarkedDates[dateString]?.customStyles?.container?.backgroundColor === '#FF597B') {
          continue;
        }
        
        allMarkedDates[dateString] = {
          ...allMarkedDates[dateString],
          customStyles: {
            container: {
              borderRadius: 0,
              backgroundColor: 'transparent'
            },
            text: {
              color: '#26D07C',
              fontWeight: '600'
            }
          }
        };
      }
    }
    
    // Mark today with a gray background
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
    
    setMarkedDates(allMarkedDates);
  };

  // Update cycle day info for selected date
  const updateSelectedDateInfo = (date: string) => {
    if (!firstPeriodDate) return;
    
    const selectedDateObj = new Date(date);
    const startDateObj = new Date(firstPeriodDate);
    
    // Only calculate cycle day if selected date is after first period
    if (selectedDateObj >= startDateObj) {
      const cycleInfo = PeriodPredictionService.getCycleInfo(firstPeriodDate, date);
      setCycleDay(cycleInfo.cycleDay);
    } else {
      setCycleDay(null);
    }
  };

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
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

  // Handle saving period dates
  const savePeriodDates = async (dates: { [date: string]: any }) => {
    try {
      await db.delete(periodDates);
      
      const dateInserts = Object.keys(dates).map(date => ({
        date
      }));
      
      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
      }
      
      setModalVisible(false);
      loadData(); // Reload data after saving
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const getConceptionChance = () => {
    if (!cycleDay) return '';
    return `${PeriodPredictionService.getPregnancyChance(cycleDay).toLowerCase()} chance to conceive`;
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const onMonthChange = (month: DateData) => {
    setCurrentMonth(`${new Date(month.dateString).toLocaleString('default', { month: 'long' })} ${new Date(month.dateString).getFullYear()}`);
  };

  const selectedDateFormatted = selectedDate ? 
    new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          markingType="custom"
          markedDates={markedDates}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          hideArrows={false}
          renderArrow={(direction: 'left' | 'right') => (
            <Ionicons 
              name={direction === 'left' ? 'chevron-back' : 'chevron-forward'} 
              size={20} 
              color="black" 
            />
          )}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#FF597B',
            selectedDayTextColor: '#ffffff',
            todayTextColor: 'black',
            dayTextColor: 'black',
            textDisabledColor: '#d9e1e8',
            dotColor: '#FF597B',
            selectedDotColor: '#ffffff',
            arrowColor: 'black',
            monthTextColor: '#000000',
            textMonthFontWeight: 'bold',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            'stylesheet.calendar.header': {
              dayHeader: {
                textAlign: 'center',
                fontSize: 14,
                fontWeight: '500',
                color: '#7B7B7B'
              },
            }
          }}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.periodDot} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.expectedPeriodDot} />
          <Text style={styles.legendText}>Expected period</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.fertilityText}>Fertility window</Text>
        </View>
      </View>
      
      <View style={styles.cycleSummary}>
        <Text style={styles.cycleSummaryTitle}>
          {selectedDateFormatted}{cycleDay ? ` • Cycle day ${cycleDay}` : ''}
        </Text>
        {cycleDay && (
          <Text style={styles.conceptionChance}>{getConceptionChance()}</Text>
        )}
      </View>
      
      <PeriodCalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={savePeriodDates}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  calendarContainer: {
    paddingTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  periodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF597B',
    marginRight: 4,
  },
  expectedPeriodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FF597B',
    borderStyle: 'dashed',
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#332F49',
  },
  fertilityText: {
    fontSize: 12,
    color: '#26D07C',
    fontWeight: '500',
  },
  cycleSummary: {
    padding: 20,
  },
  cycleSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#332F49',
    marginBottom: 4,
  },
  conceptionChance: {
    fontSize: 14,
    color: '#878595',
  },
});
