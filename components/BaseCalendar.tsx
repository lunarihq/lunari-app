import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { CustomMarking, MarkedDates, SelectionRules, formatDateString } from '../app/types/calendarTypes';
import Colors from '../app/styles/colors';

// Constants
const MONTH_FONT_SIZE = 16;
export const DAY_FONT_SIZE = 16;

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
  renderDay?: React.ComponentType<any>;
  // Optional callback for auto-selection
  onAutoSelect?: (startDay: DateData, selectedDays: DateData[]) => void;
  // Enable horizontal scrolling
  horizontal?: boolean;
  // Custom calendar width for horizontal scrolling
  calendarWidth?: number;
  // Max amount of months allowed to scroll to the past
  pastScrollRange?: number;
  // Max amount of months allowed to scroll to the future
  futureScrollRange?: number;
  // Hide day names for each month (to show them only once at top)
  hideDayNames?: boolean;
  // Dynamic calendar height
  calendarHeight?: number;
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
  horizontal = false,
  calendarWidth,
  pastScrollRange = 12,
  futureScrollRange = 12,
  hideDayNames = false,
  calendarHeight,
}: BaseCalendarProps) {
  // Get device screen width for default calendarWidth
  const screenWidth = Dimensions.get('window').width;
  
  // Create a wrapped onDayPress that respects selectionRules
  const handleDayPress = useCallback((day: DateData) => {
    // If in view mode, pass through normally
    if (mode === 'view') {
      onDayPress(day);
      return;
    }
    
    // In selection mode, apply rules if specified
    if (selectionRules?.disableFuture) {
      const todayDateStr = formatDateString(new Date());
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
  }, [mode, onDayPress, selectionRules?.disableFuture, markedDates]);

  // Default day component if none provided
  const DefaultDay: React.FC<any> = ({ date, state, marking }: { date?: DateData; state: string; marking: CustomMarking }) => {
    const customMarking = marking;
    const isSelected = customMarking?.selected || 
                      customMarking?.customStyles?.container?.backgroundColor === Colors.accentPink;
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';
    
    // Determine if this is a period day (has the pink background)
    const isPeriodDay = customMarking?.customStyles?.container?.backgroundColor === Colors.accentPink;
    
    // Check if this day has a custom container style (for selection background)
    const hasCustomContainer = customMarking?.customContainerStyle;
    
    if (hasCustomContainer) {
      // Render with layered background for selection
      return (
        <View style={styles.dayContainer}>
          <View style={customMarking.customContainerStyle}>
            <TouchableOpacity
              style={[
                styles.dayButton,
                isSelected ? styles.selectedDay : null,
                customMarking?.customStyles?.container,
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
                 isPeriodDay ? { color: Colors.white } : null,
                isDisabled ? styles.disabledDayText : null,
                isToday ? styles.todayText : null,
                customMarking?.customStyles?.text
              ]}>
                {date ? date.day : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Render normally without custom container
      return (
        <View style={styles.dayContainer}>
          <TouchableOpacity
            style={[
              styles.dayButton,
              isSelected ? styles.selectedDay : null,
              customMarking?.customStyles?.container,
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
                 isPeriodDay ? { color: Colors.white } : null,
              isDisabled ? styles.disabledDayText : null,
              isToday ? styles.todayText : null,
              customMarking?.customStyles?.text
            ]}>
              {date ? date.day : ''}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Default header component if none provided
  const defaultRenderHeader = useCallback((date: any) => {
    const headerDate = new Date(date);
    const monthName = headerDate.toLocaleString('default', { month: 'long' });
    const year = headerDate.getFullYear();
    
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {monthName} {year}
        </Text>
      </View>
    );
  }, []);

  // Determine whether to hide arrows based on mode
  const hideArrows = true;

  // Day names row component (only shown when hideDayNames is true on individual months)
  const dayNames = useMemo(() => ['M', 'T', 'W', 'T', 'F', 'S', 'S'], []);
  
  const renderDayNamesHeader = useCallback(() => {
    if (!hideDayNames) return null;
    
    return (
      <View style={styles.dayNamesContainer}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  }, [hideDayNames, dayNames]);

  return (
    <View style={{ flex: 1 }}>
      {renderDayNamesHeader()}
      <CalendarList
        key={calendarKey}
        current={current}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={onMonthChange}
        hideExtraDays={true}
        hideArrows={hideArrows}
        firstDay={1}
        hideDayNames={hideDayNames}
        dayComponent={renderDay || DefaultDay}
        renderHeader={renderHeader || defaultRenderHeader}
        // Horizontal scrolling props
        horizontal={horizontal}
        pagingEnabled={horizontal}
        calendarWidth={calendarWidth || screenWidth}
        calendarHeight={calendarHeight}
        pastScrollRange={pastScrollRange}
        futureScrollRange={futureScrollRange}
        scrollEnabled={true}
        showScrollIndicator={false}
        renderArrow={(direction: 'left' | 'right') => (
          <Ionicons 
            name={direction === 'left' ? 'chevron-back' : 'chevron-forward'} 
            size={20} 
            color="black"
             
          />
        )}
        theme={{
           backgroundColor: Colors.white,
           calendarBackground: Colors.white,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: 'transparent',
          selectedDayTextColor: '#000000',
          todayTextColor: '#000000',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
           dotColor: Colors.primary,
           selectedDotColor: Colors.primary,
          arrowColor: 'black',
          monthTextColor: '#000000',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: MONTH_FONT_SIZE,
          textDayHeaderFontSize: 14,
          // @ts-ignore: Known theme typing issue in react-native-calendars
          'stylesheet.calendar.header': {
            dayHeader: {
              marginTop: 2,
              marginBottom: 7,
              width: 32,
              textAlign: 'center',
              fontSize: 14,
               color: Colors.textPrimary,
            },
          },
          'stylesheet.day.basic': {
            base: {
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }
          },
          'stylesheet.calendar.main': {
            container: {
              borderBottomWidth: 1,
               borderBottomColor: Colors.border,
              paddingBottom: 2,
            }
          }
        }}
      />
    </View>
  );
}

// Shared styles for all calendar instances
const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 58,
    backgroundColor: 'white',
  },


  dayButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  dayText: {
    fontSize: DAY_FONT_SIZE,
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
    // Remove today background styling
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
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: MONTH_FONT_SIZE,
    fontWeight: 'bold',
    color: '#000000',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 34,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9F0FF',
  },
  dayNameCell: {
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#29263B',
  },
}); 

export default BaseCalendar;