import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './styles/theme';
import { useState, useEffect } from 'react';
import { DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  BaseCalendar,
  DAY_FONT_SIZE,
  styles as baseCalendarStyles,
} from '../components/BaseCalendar';
import {
  CustomMarking,
  MarkedDates,
  DEFAULT_SELECTED_STYLE,
  formatDateString,
  generateDateRange,
} from './types/calendarTypes';
import { db, getSetting } from '../db';
import { periodDates } from '../db/schema';

export default function PeriodCalendarScreen() {
  const { colors } = useTheme();
  const [tempDates, setTempDates] = useState<MarkedDates>({});
  const [userPeriodLength, setUserPeriodLength] = useState<number>(5);

  // Get current date for today marker
  const today = formatDateString(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);
  const [calendarKey, setCalendarKey] = useState(Date.now().toString());
  const [displayedMonth, setDisplayedMonth] = useState(today);

  // Load user settings and saved dates when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user period length setting
        const periodLength = await getSetting('userPeriodLength');
        if (periodLength) {
          setUserPeriodLength(parseInt(periodLength, 10));
        }

        // Load saved period dates
        const saved = await db.select().from(periodDates);

        const dates = saved.reduce(
          (acc: { [key: string]: any }, curr) => {
            acc[curr.date] = DEFAULT_SELECTED_STYLE;
            return acc;
          },
          {} as { [key: string]: any }
        );

        setTempDates(dates);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    setCalendarKey(Date.now().toString());
  }, []);

  // Function to check if the current displayed month is different from today's month
  const isTodayButtonVisible = () => {
    // Extract year and month from today string (YYYY-MM-DD)
    const todayYear = today.substring(0, 4);
    const todayMonth = today.substring(5, 7);

    // Extract year and month from displayedMonth string (YYYY-MM-DD)
    const currentYear = displayedMonth.substring(0, 4);
    const currentMonth_ = displayedMonth.substring(5, 7);

    // Return true if they are different (button should be visible)
    return todayYear !== currentYear || todayMonth !== currentMonth_;
  };

  const onDayPress = (day: DateData) => {
    const selectedDate = new Date(day.dateString);
    const todayDate = new Date(today);

    const updatedDates = { ...tempDates };

    const prevDay = new Date(day.dateString);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayString = formatDateString(prevDay);

    const isAlreadySelected = !!updatedDates[day.dateString];
    const isFuture = selectedDate > todayDate;
    const isStartOfSelection = !updatedDates[prevDayString];

    // Disallow selecting future days, but allow deselecting them if they were auto-selected
    if (isFuture && !isAlreadySelected) {
      return;
    }

    // Toggle off if already selected
    if (isAlreadySelected) {
      delete updatedDates[day.dateString];
      setTempDates(updatedDates);
      return;
    }

    // Start auto-selection when tapping a day that is not preceded by a selected day
    if (isStartOfSelection) {
      const dateRange = generateDateRange(day.dateString, userPeriodLength);
      // Allow auto-selection to include future days regardless of start (past or today)
      dateRange.forEach(dateString => {
        updatedDates[dateString] = DEFAULT_SELECTED_STYLE;
      });
      setTempDates(updatedDates);
      return;
    }

    // Fallback: single-day selection for non-future dates
    updatedDates[day.dateString] = DEFAULT_SELECTED_STYLE;
    setTempDates(updatedDates);
  };

  const goToToday = () => {
    setCurrentMonth(today);
    setDisplayedMonth(today);
    // Force calendar to re-render with new current prop
    setCalendarKey(Date.now().toString());
  };

  // Handler for month change
  const onMonthChange = (month: DateData) => {
    setDisplayedMonth(month.dateString);
  };

  // Create modified markedDates with TODAY text
  const markedDatesWithToday = { ...tempDates };
  if (markedDatesWithToday[today]) {
    markedDatesWithToday[today] = {
      ...markedDatesWithToday[today],
      marked: true,
      todayStyle: { backgroundColor: '#e6e6e6' },
    };
  } else {
    markedDatesWithToday[today] = {
      marked: true,
      todayStyle: { backgroundColor: '#e6e6e6' },
    };
  }

  // Save dates and go back
  const handleSave = async () => {
    try {
      await db.delete(periodDates);

      const dateInserts = Object.keys(tempDates).map(date => ({
        date,
      }));

      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
      }
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Period dates saved',
        visibilityTime: 3000,
      });
      
      router.back();
    } catch (error) {
      console.error('Error saving dates:', error);
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error. Please try again.',
        visibilityTime: 3000,
      });
      
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
    const isSelected =
      customMarking?.selected ||
      customMarking?.customStyles?.container?.backgroundColor ===
        colors.accentPink;
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';

    // Check if date is in the future
    const isFuture = date ? new Date(date.dateString) > new Date(today) : false;

    return (
      <View style={baseCalendarStyles.dayContainer}>
        <TouchableOpacity
          onPress={() => (date ? onDayPress(date) : null)}
          disabled={isDisabled}
        >
          {/* Day number */}
          <Text
            style={[
              styles.customDayText,
              { color: colors.textPrimary },
              isToday ? baseCalendarStyles.todayText : null,
              isDisabled ? styles.disabledDayText : null,
              isSelected ? styles.selectedDayText : null,
            ]}
          >
            {date ? date.day : ''}
          </Text>

          {/* Day indicator - always render a circle */}
          <View
            style={[
              styles.dayIndicator,
              isSelected ? styles.selectedDayIndicator : null,
              isFuture ? styles.futureDayIndicator : null,
            ]}
          >
            {isSelected && !isFuture && (
              <Ionicons
                name="checkmark-sharp"
                size={16}
                color={colors.white}
                style={styles.checkmark}
              />
            )}
          </View>
        </TouchableOpacity>
        {isToday && (
          <Text style={[baseCalendarStyles.todayLabel, { marginTop: 2 }]}>
            Today
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.panel }]}>
      {/* Header with padding for status bar, similar to symptom-tracking.tsx */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Edit Period
        </Text>
        {isTodayButtonVisible() && (
          <TouchableOpacity onPress={goToToday}>
            <Text
              style={[
                baseCalendarStyles.todayButtonText,
                styles.todayButtonText,
                { color: colors.primary },
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
        )}
        {!isTodayButtonVisible() && <View style={{ width: 24 }} />}
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
            autoSelectDays: userPeriodLength,
          }}
          renderDay={renderCustomDay}
          hideDayNames={true}
          futureScrollRange={1}
          pastScrollRange={12}
        />
      </View>

      {/* Footer with Save/Cancel buttons */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={[styles.cancelButtonText, { color: colors.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.white }]}>
            Save
          </Text>
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
    paddingHorizontal: 18,
    height: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 63,
  },
  calendarContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
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
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 80,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },

  todayButtonText: {
    paddingTop: 64,
  },

  customDayText: {
    fontSize: DAY_FONT_SIZE,
    textAlign: 'center',
    marginBottom: 1,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayIndicator: {
    backgroundColor: '#FB3192',
    borderColor: '#FB3192',
  },

  disabledDayText: {
    color: '#d9e1e8',
  },
  selectedDayText: {
    color: '#FB3192',
  },
  checkmark: {
    marginTop: 0,
  },
  futureDayIndicator: {
    borderWidth: 1,
  },
});
