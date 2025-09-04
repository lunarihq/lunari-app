import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { useCallback, useMemo } from 'react';
import {
  CustomMarking,
  MarkedDates,
  SelectionRules,
  formatDateString,
} from '../app/types/calendarTypes';
import { useTheme } from '../app/styles/theme';

// Constants
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

  pastScrollRange = 12,
  futureScrollRange = 12,
  hideDayNames = false,
  calendarHeight,
}: BaseCalendarProps) {
  const { colors } = useTheme();

  // Create a wrapped onDayPress that respects selectionRules
  const handleDayPress = useCallback(
    (day: DateData) => {
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
    },
    [mode, onDayPress, selectionRules?.disableFuture, markedDates]
  );

  // Default day component if none provided
  const DefaultDay: React.FC<any> = ({
    date,
    state,
    marking,
  }: {
    date?: DateData;
    state: string;
    marking: CustomMarking;
  }) => {
    const customMarking = marking;
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';

    // Determine if this is a period day (has the pink background)
    const isPeriodDay =
      customMarking?.customStyles?.container?.backgroundColor ===
      colors.accentPink;

    // Calculate styles once
    const buttonStyles = [
      styles.dayButton,
      customMarking?.customStyles?.container,
      isToday && customMarking?.todayStyle,
      isDisabled ? styles.disabledDay : null,
    ];

    const textStyles = [
      styles.dayText,
      { color: colors.textPrimary },
      isPeriodDay ? { color: colors.white } : null,
      isDisabled ? styles.disabledDayText : null,
      isToday ? styles.todayText : null,
      customMarking?.customStyles?.text,
    ];

    const dayButton = (
      <TouchableOpacity
        style={buttonStyles}
        onPress={() => (date ? handleDayPress(date) : null)}
        disabled={isDisabled}
      >
        <Text style={textStyles}>{date ? date.day : ''}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.dayContainer}>
        {dayButton}
      </View>
    );
  };

  // Default header component if none provided
  const defaultRenderHeader = useCallback(
    (date: any) => {
      const headerDate = new Date(date);
      const monthName = headerDate.toLocaleString('default', { month: 'long' });
      const year = headerDate.getFullYear();

      return (
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>
            {monthName} {year}
          </Text>
        </View>
      );
    },
    [colors]
  );

  // Determine whether to hide arrows based on mode
  const hideArrows = true;

  // Day names row component (only shown when hideDayNames is true on individual months)
  const dayNames = useMemo(() => ['M', 'T', 'W', 'T', 'F', 'S', 'S'], []);

  const renderDayNamesHeader = useCallback(() => {
    if (!hideDayNames) return null;

    return (
      <View
        style={[
          styles.dayNamesContainer,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.panel,
          },
        ]}
      >
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayNameCell}>
            <Text style={[styles.dayNameText, { color: colors.textPrimary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>
    );
  }, [hideDayNames, dayNames, colors]);

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
        calendarHeight={calendarHeight}
        pastScrollRange={pastScrollRange}
        futureScrollRange={futureScrollRange}
        scrollEnabled={true}
        showScrollIndicator={false}
        theme={{
          backgroundColor: colors.panel,
          calendarBackground: colors.panel,
          textDayHeaderFontSize: 14,
          // @ts-ignore: Known theme typing issue in react-native-calendars
          'stylesheet.calendar.header': {
            dayHeader: {
              marginTop: 2,
              marginBottom: 7,
              width: 32,
              textAlign: 'center',
              fontSize: 14,
              color: colors.textPrimary,
            },
          },
          'stylesheet.calendar.main': {
            container: {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingBottom: 2,
            },
          },
        }}
      />
    </View>
  );
}

// Shared styles for all calendar instances
export const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 40,
    height: 64,
  },
  dayButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'red',
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },

  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 34,
    borderBottomWidth: 1,
  },
  dayNameCell: {
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BaseCalendar;
