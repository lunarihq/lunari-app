import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BaseCalendar } from './components/BaseCalendar';
import { CustomMarking, MarkedDates, DEFAULT_SELECTED_STYLE, formatDateString, generateDateRange } from './types/calendarTypes';
import { db } from '../db';
import { periodDates } from '../db/schema';

export default function PeriodCalendarScreen() {
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [tempDates, setTempDates] = useState<MarkedDates>({});
  
  // Get current date for today marker
  const today = formatDateString(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);
  const [calendarKey, setCalendarKey] = useState(Date.now().toString());

  // Load saved dates when the component mounts
  useEffect(() => {
    const loadSavedDates = async () => {
      try {
        const saved = await db.select().from(periodDates);
        
        const dates = saved.reduce((acc: { [key: string]: any }, curr) => { 
          acc[curr.date] = DEFAULT_SELECTED_STYLE;
          return acc;
        }, {} as { [key: string]: any });
        
        setSelectedDates(dates);
        setTempDates(dates);
      } catch (error) {
        console.error('Error loading dates:', error);
      }
    };
    
    loadSavedDates();
    setCalendarKey(Date.now().toString());

  }, []);

  // Function to check if the current displayed month is different from today's month
  const isTodayButtonVisible = () => {
    // Extract year and month from today string (YYYY-MM-DD)
    const todayYear = today.substring(0, 4);
    const todayMonth = today.substring(5, 7);
    
    // Extract year and month from currentMonth string (YYYY-MM-DD)
    const currentYear = currentMonth.substring(0, 4);
    const currentMonth_ = currentMonth.substring(5, 7);
    
    // Return true if they are different (button should be visible)
    return todayYear !== currentYear || todayMonth !== currentMonth_;
  };

  const onDayPress = (day: DateData) => {
    // Check if date is in the future and return if it is
    const selectedDate = new Date(day.dateString);
    const todayDate = new Date(today);
    if (selectedDate > todayDate) {
      return; // Exit early if future date
    }

    const updatedDates = { ...tempDates };

    // Normal behavior for today and past dates
    if (updatedDates[day.dateString]) {
      delete updatedDates[day.dateString];
    } else {
      // Check if this is a new period start (no adjacent dates before it)
      const prevDay = new Date(day.dateString);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevDayString = formatDateString(prevDay);
      
      if (!updatedDates[prevDayString]) {
        // Auto-select 5 days, but don't include future dates
        const dateRange = generateDateRange(day.dateString, 5);
        
        // Filter out future dates from the range
        const filteredDateRange = dateRange.filter(dateString => {
          const rangeDate = new Date(dateString);
          return rangeDate <= todayDate;
        });
        
        // Apply selection to all days in filtered range
        filteredDateRange.forEach(dateString => {
          updatedDates[dateString] = DEFAULT_SELECTED_STYLE;
        });
      } else {
        // Normal single day selection
        updatedDates[day.dateString] = DEFAULT_SELECTED_STYLE;
      }
    }
    
    setTempDates(updatedDates);
  };

  const goToToday = () => {
    setCurrentMonth(today);
    // Force calendar to re-render with new current prop
    setCalendarKey(Date.now().toString());
  };
  
  // Handler for month change
  const onMonthChange = (month: DateData) => {

  };
  
  // Create modified markedDates with TODAY text
  const markedDatesWithToday = { ...tempDates };
  if (markedDatesWithToday[today]) {
    markedDatesWithToday[today] = {
      ...markedDatesWithToday[today],
      marked: true,
      todayStyle: { backgroundColor: '#e6e6e6' }
    };
  } else {
    markedDatesWithToday[today] = {
      marked: true,
      todayStyle: { backgroundColor: '#e6e6e6' }
    };
  }

  // Save dates and go back
  const handleSave = async () => {
    try {
      await db.delete(periodDates);
      
      const dateInserts = Object.keys(tempDates).map(date => ({
        date
      }));
      
      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
        
        // Add a small delay to ensure database changes are complete
        // before navigating back to the previous screen
        setTimeout(() => {
          router.back();
        }, 100);
      } else {
        // No dates to insert, so just go back
        router.back();
      }
    } catch (error) {
      console.error('Error saving dates:', error);
      router.back();
    }
  };

  // Go back without saving
  const handleCancel = () => {
    router.back();
  };

  // Custom day renderer for the period calendar
  const renderCustomDay = ({ date, state, marking }: any) => {
    const customMarking = marking as CustomMarking;
    const isSelected = customMarking?.selected || 
                      customMarking?.customStyles?.container?.backgroundColor === '#FF597B';
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';
    
    // Check if date is in the future
    const isFuture = date ? new Date(date.dateString) > new Date(today) : false;
    
    // Determine if this is a period day (has the pink background)
    const isPeriodDay = customMarking?.customStyles?.container?.backgroundColor === '#FF597B';
    
    return (
      <TouchableOpacity 
        style={styles.customDayContainer}
        onPress={() => date ? onDayPress(date) : null}
        disabled={isDisabled}
      >
        {/* Day number */}
        <Text style={[
          styles.customDayText,
          isToday ? styles.todayText : null,
          isDisabled ? styles.disabledDayText : null,
          isSelected ? styles.selectedDayText : null,
        ]}>
          {date ? date.day : ''}
        </Text>
        
        {/* Day indicator - always render a circle */}
        <View style={[
          styles.dayIndicator,
          isSelected ? styles.selectedDayIndicator : null,
          isToday ? styles.todayIndicator : null,
          isFuture ? styles.futureDayIndicator : null,
        ]}>
          {isSelected && !isFuture && (
            <Ionicons 
              name="checkmark" 
              size={14} 
              color="#FFFFFF" 
              style={styles.checkmark} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with padding for status bar, similar to symptom-tracking.tsx */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Period</Text>
        {isTodayButtonVisible() && (
          <TouchableOpacity onPress={goToToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}
        {!isTodayButtonVisible() && <View style={{width: 24}} />}
      </View>
      
      <View style={styles.calendarContainer}>
          <BaseCalendar
            mode="selection"
            calendarKey={calendarKey}
            current={currentMonth}
            markedDates={markedDatesWithToday}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            selectionRules={{
              disableFuture: true,
              autoSelectDays: 5
              
            }}
            renderDay={renderCustomDay}
            hideDayNames={true}
            futureScrollRange={1}
          />

      </View>

      {/* Footer with Save/Cancel buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 65, // Extra padding at top for status bar, like in symptom-tracking.tsx
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  calendarContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F5FEB',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#4F5FEB',
    paddingVertical: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
 
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F5FEB',
  },
  // Custom day styles
  customDayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 32,
    height: 55,
    marginBottom: 6,
  },
  customDayText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 2,
    color: '#000',
  },
  dayIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#99A6C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayIndicator: {
    backgroundColor: '#FF597B',
    borderColor: '#FF597B',
  },
  todayIndicator: {
    borderWidth: 4,
  },
  todayText: {
    fontWeight: 'bold',
  },
  disabledDayText: {
    color: '#d9e1e8',
  },
  selectedDayText: {
    color: '#FF597B',
  },
  checkmark: {
    marginTop: 0,
  },
  futureDayIndicator: {
    borderWidth: 1,
  },
}); 