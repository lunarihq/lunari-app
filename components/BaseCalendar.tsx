import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { CustomMarking, MarkedDates, SelectionRules } from './CalendarTypes';

export type BaseCalendarProps = {
  // Mode determines the calendar's primary purpose
  mode: 'selection' | 'view';
  // Current visible date
  current?: string;
  // Marked dates with their styles
  markedDates: MarkedDates;
  // Callback for day press
  onDayPress: (day: DateData) => void;
  // Optional callback for month change
  onMonthChange?: (month: DateData) => void;
  // Rules for selection mode
  selectionRules?: SelectionRules;
  // Optional calendar key for forcing re-renders
  calendarKey?: string | number;
  // Optional custom header component
  renderHeader?: (month: string) => React.ReactNode;
  // Optional custom day component
  renderDay?: (props: any) => React.ReactNode;
  // Optional callback for auto-selection
  onAutoSelect?: (startDay: DateData, selectedDays: DateData[]) => void;
};

export function BaseCalendar({
  mode,
  current,
  markedDates,
  onDayPress,
  onMonthChange,
  selectionRules,
  calendarKey,
  renderHeader,
  renderDay,
  onAutoSelect,
}: BaseCalendarProps) {
  // Create a wrapped onDayPress that respects selectionRules
  const handleDayPress = (day: DateData) => {
    // If in view mode, pass through normally
    if (mode === 'view') {
      onDayPress(day);
      return;
    }
    
    // In selection mode, apply rules if specified
    if (selectionRules?.disableFuture) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      if (day.dateString > todayDateStr) {
        // Allow deselection of future dates if already selected
        if (markedDates[day.dateString]) {
          onDayPress(day);
        }
        return; // Ignore selection of future dates
      }
    }
    
    // No special handling needed, pass through to parent component
    onDayPress(day);
  };

  // Default day component if none provided
  const defaultRenderDay = ({ date, state, marking }: any) => {
    const customMarking = marking as CustomMarking;
    const isSelected = customMarking?.selected || 
                      customMarking?.customStyles?.container?.backgroundColor === '#FF597B';
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';
    
    // Determine if this is a period day (has the pink background)
    const isPeriodDay = customMarking?.customStyles?.container?.backgroundColor === '#FF597B';
    
    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            isSelected ? styles.selectedDay : null,
            customMarking?.customStyles?.container,
            customMarking?.customContainerStyle,
            isToday ? styles.todayDayButton : null,
            isToday && customMarking?.todayStyle,
            isDisabled ? styles.disabledDay : null
          ]}
          onPress={() => date ? handleDayPress(date) : null}
          disabled={isDisabled}
        >
          <Text style={[
            styles.dayText,
            isSelected && !isPeriodDay ? styles.selectedDayText : null,
            isPeriodDay ? { color: '#FFFFFF' } : null,
            isDisabled ? styles.disabledDayText : null,
            isToday ? styles.todayText : null,
            customMarking?.customStyles?.text
          ]}>
            {date ? date.day : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Determine whether to hide arrows based on mode
  const hideArrows = mode === 'selection' ? false : false;

  return (
    <Calendar
      key={calendarKey}
      current={current}
      markingType="custom"
      markedDates={markedDates}
      onDayPress={handleDayPress}
      onMonthChange={onMonthChange}
      hideExtraDays={true}
      hideArrows={hideArrows}
      firstDay={1}
      dayComponent={renderDay || defaultRenderDay}
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
            color: '#4F4F4F'
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
      }}
    />
  );
}

// Shared styles for all calendar instances
const styles = StyleSheet.create({
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
    backgroundColor: '#e6e6e6',
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
}); 