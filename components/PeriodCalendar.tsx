import { View, Modal, Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (dates: { [date: string]: any }) => void;
  selectedDates: { [date: string]: any };
  setSelectedDates: (dates: { [date: string]: any }) => void;
};

// Custom type for our marked dates with todayText
type CustomMarking = {
  selected?: boolean;
  selectedColor?: string;
  customContainerStyle?: any;
  marked?: boolean;
  todayStyle?: {
    backgroundColor: string;
  };
};

export function PeriodCalendarModal({ visible, onClose, onSave, selectedDates, setSelectedDates }: Props) {
  const [tempDates, setTempDates] = useState<{[date: string]: CustomMarking}>(selectedDates);
  // Get current date for today marker
  const today = new Date().toISOString().split('T')[0];
  const [currentMonth, setCurrentMonth] = useState(today);
  const [calendarKey, setCalendarKey] = useState(Date.now().toString());

  useEffect(() => {
    setTempDates(selectedDates);
  }, [visible]); // Reset temp dates when modal opens

  const onDayPress = (day: DateData) => {
    const selectedDateStr = day.dateString;
    const todayDateStr = new Date().toISOString().split('T')[0];
    const updatedDates = { ...tempDates };

    // Check if the date is in the future
    if (selectedDateStr > todayDateStr) {
      // Allow deselection of future dates, but prevent selection
      if (updatedDates[day.dateString]) {
        delete updatedDates[day.dateString];
        setTempDates(updatedDates);
      }
      return;  // Ignore new selections of future dates
    }

    // Normal behavior for today and past dates
    if (updatedDates[day.dateString]) {
      delete updatedDates[day.dateString];
    } else {
      // Check if this is a new period start (no adjacent dates before it)
      const prevDay = new Date(day.dateString);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevDayString = prevDay.toISOString().split('T')[0];
      
      if (!updatedDates[prevDayString]) {
        // Auto-select 5 days, including future dates if needed
        for (let i = 0; i < 5; i++) {
          const date = new Date(day.dateString);
          date.setDate(date.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          
          // Allow future dates in auto-selection
          updatedDates[dateString] = { 
            selected: true, 
            selectedColor: '#FF597B', 
            customContainerStyle: { 
              borderWidth: 2, 
              borderColor: '#FF597B', 
              backgroundColor: '#FFEAEE' 
            } 
          };
        }
      } else {
        // Normal single day selection
        updatedDates[day.dateString] = { 
          selected: true, 
          selectedColor: '#FF597B', 
          customContainerStyle: { 
            borderWidth: 2, 
            borderColor: '#FF597B', 
            backgroundColor: '#FFEAEE' 
          } 
        };
      }
    }
    
    setTempDates(updatedDates);
  };

  const goToToday = () => {
    setCurrentMonth(today);
    // Force calendar to re-render with new current prop
    setCalendarKey(Date.now().toString());
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

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
            <Text style={styles.headerTitle}>Edit period</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarContainer}>
          <Calendar
            key={calendarKey}
            current={currentMonth}
            onDayPress={onDayPress}
            markedDates={markedDatesWithToday}
            markingType="custom"
            hideExtraDays={true}
            dayComponent={({date, state, marking}: any) => {
              const customMarking = marking as CustomMarking;
              const isSelected = customMarking?.selected;
              
              return (
                <View style={styles.dayContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      isSelected ? styles.selectedDay : null,
                      customMarking?.customContainerStyle,
                      state === 'today' ? styles.todayDayButton : null,
                      state === 'today' ? customMarking?.todayStyle : null,
                      state === 'disabled' ? styles.disabledDay : null
                    ]}
                    onPress={() => date ? onDayPress(date) : null}
                    disabled={state === 'disabled'}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected ? styles.selectedDayText : null,
                      state === 'disabled' ? styles.disabledDayText : null,
                      state === 'today' ? styles.todayText : null
                    ]}>
                      {date ? date.day : ''}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            theme={
              {
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: 'transparent',
                selectedDayTextColor: '#000000',
                todayTextColor: '#000000',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#FF597B',
                selectedDotColor: '#FF597B',
                arrowColor: 'black',
                monthTextColor: '#000000',
                textMonthFontWeight: 'bold',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                dayNamesShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                // Custom styling for header and day components
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 10,
                    alignItems: 'center'
                  },
                  monthText: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000000',
                    margin: 10
                  },
                  dayHeader: {
                    marginTop: 2,
                    marginBottom: 7,
                    width: 32,
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#b6c1cd'
                  },
                },
                'stylesheet.day.basic': {
                  base: {
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              } as any
            }
          />
        </View>

        {/* Footer with Save/Cancel buttons */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => onSave(tempDates)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  calendarContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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
    color: '#FF597B',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FF597B',
    paddingVertical: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 45,
  },
  dayButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: '#d9e1e8',
  },
  todayText: {
    fontWeight: 'bold',
  },
  todayDayButton: {
    // This is for the day circle, not to be confused with the header Today button
  },
  selectedDay: {
    backgroundColor: '#FFEAEE',
    borderWidth: 2,
    borderColor: '#FF597B',
  },
  selectedDayText: {
    color: '#FF597B',
    fontWeight: '500',
  },
  todayButton: {
    padding: 8,
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF597B',
  },
});
