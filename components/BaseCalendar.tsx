import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { useCallback, useMemo, memo } from 'react';
import {
  CustomMarking,
  MarkedDates,
  SelectionRules,
  formatDateString,
} from '../types/calendarTypes';
import { useTheme } from '../styles/theme';

// Constants
export const DAY_FONT_SIZE = 16;

// Memoized DefaultDay component to prevent recreation on every render
const DefaultDay = memo<{
  date?: DateData;
  state: string;
  marking: CustomMarking;
  colors: any;
  onDayPress: (date: DateData) => void;
  customDayContainerStyle?: any;
}>(({ date, state, marking, colors, onDayPress, customDayContainerStyle }) => {
  const customMarking = marking;
  const isToday = state === 'today';
  const isDisabled = state === 'disabled';
  const isSelected = customMarking?.selected;

  // Determine if this is a period day (has the pink background)
  const isPeriodDay =
    customMarking?.customStyles?.container?.backgroundColor ===
    colors.accentPink;

  // Memoize styles to prevent recalculation on every render
  const buttonStyles = useMemo(
    () => [
      styles.dayButton,
      customMarking?.customStyles?.container,
      isToday && customMarking?.todayStyle,
      isToday && { backgroundColor: colors.primaryLight },
      isDisabled ? styles.disabledDay : null,
    ],
    [customMarking, isToday, isDisabled, colors.primaryLight]
  );

  const textStyles = useMemo(
    () => [
      styles.dayText,
      { color: colors.textPrimary },
      // Apply any explicit text color provided by markings first
      customMarking?.customStyles?.text,
      // Use white text only when the period-day pink background is actually applied
      isPeriodDay && !isToday ? { color: colors.white } : null,
      isDisabled ? styles.disabledDayText : null,
      isToday ? styles.todayText : null,
      // Ensure today always uses readable color in light mode
      isToday ? { color: colors.textPrimary } : null,
    ],
    [
      colors.textPrimary,
      colors.white,
      isPeriodDay,
      isToday,
      isDisabled,
      customMarking?.customStyles?.text,
    ]
  );

  const handlePress = useCallback(() => {
    if (date) onDayPress(date);
  }, [date, onDayPress]);

  return (
    <View style={[styles.dayContainer, customDayContainerStyle]}>
      <TouchableOpacity
        style={buttonStyles}
        onPress={handlePress}
        disabled={isDisabled}
      >
        <Text style={textStyles}>{date ? date.day : ''}</Text>
      </TouchableOpacity>
      {isSelected && (
        <View
          style={[styles.selectionIndicator, { borderColor: colors.primary }]}
        />
      )}
      {isToday && (
        <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>
          Today
        </Text>
      )}
      {customMarking?.hasHealthLogs && (
        <View
          style={[styles.healthLogDot, { backgroundColor: colors.primary }]}
        />
      )}
    </View>
  );
});

DefaultDay.displayName = 'DefaultDay';

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
  // Optional custom style for day container
  customDayContainerStyle?: any;

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
  customDayContainerStyle,

  pastScrollRange = 12,
  futureScrollRange = 12,
  hideDayNames = false,
  calendarHeight = 495,
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

  // Memoized day component wrapper that passes colors and handleDayPress
  const MemoizedDayComponent = useCallback(
    (props: any) => (
      <DefaultDay
        {...props}
        colors={colors}
        onDayPress={handleDayPress}
        customDayContainerStyle={customDayContainerStyle}
      />
    ),
    [colors, handleDayPress, customDayContainerStyle]
  );

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
        dayComponent={renderDay || MemoizedDayComponent}
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
              color: colors.textPrimary,
            },
          },
          'stylesheet.calendar.main': {
            container: {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
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
    width: 48,
    height: 64,
    marginBottom: -4,
  },
  dayButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
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
  todayLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 13,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 1.2,
    width: 38,
    height: 38,
    borderRadius: 32,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  healthLogDot: {
    position: 'absolute',
    bottom: 16,
    right: 21,
    width: 6,
    height: 6,
    borderRadius: 16,
  },
});

export default BaseCalendar;
