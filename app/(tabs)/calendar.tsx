import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import { useTheme } from '../styles/theme';
import { DateData } from 'react-native-calendars';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import { BaseCalendar } from '../../components/BaseCalendar';
import { CalendarBottomSheet } from '../../components/CalendarBottomSheet';
import { formatDateString } from '../types/calendarTypes';
import { useCalendarData } from '../../hooks/useCalendarData';
import { useCalendarDates } from '../../hooks/useCalendarDates';
import { useCycleCalculations } from '../../hooks/useCycleCalculations';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const isFocused = useIsFocused();

  const {
    firstPeriodDate,
    allPeriodDates,
    userCycleLength,
    userPeriodLength,
    averageCycleLength,
    loadData,
  } = useCalendarData(colors);

  const {
    generateMarkedDates,
    getMarkedDatesWithSelection,
    getSelectionMarkedDates,
  } = useCalendarDates({ colors, userCycleLength, userPeriodLength });

  const { cycleDay, setCycleDay, calculateCycleDay } =
    useCycleCalculations({ firstPeriodDate, allPeriodDates, userCycleLength });

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    formatDateString(new Date())
  );
  const [currentDate] = useState(formatDateString(new Date()));
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [displayedMonth, setDisplayedMonth] = useState(
    formatDateString(new Date())
  );
  const params = useLocalSearchParams();
  const navigation = useNavigation();



  // Check if we should navigate to the period calendar screen from URL params
  useEffect(() => {
    if (params.openPeriodModal === 'true') {
      router.push('/period-calendar');
    }
  }, [params.openPeriodModal]);

  // Listen for data deletion events to refresh calendar
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('dataDeleted', async () => {
      const result = await loadData();
      if (result && result.dates && result.mostRecentStart && result.periods) {
        generateMarkedDates(result.dates, result.mostRecentStart, result.periods);
      }
      const today = formatDateString(new Date());
      setSelectedDate(today);
      setDisplayedMonth(today);
      setCalendarKey(Date.now());
    });

    return () => listener.remove();
  }, [loadData, generateMarkedDates]);



  const selectionMarkedDates = useMemo(
    () => getSelectionMarkedDates(selectedDate),
    [selectedDate, getSelectionMarkedDates]
  );

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      const reloadData = async () => {
        const result = await loadData();
        if (result && result.dates && result.mostRecentStart && result.periods) {
          generateMarkedDates(result.dates, result.mostRecentStart, result.periods);
        }
        const today = formatDateString(new Date());
        setSelectedDate(today);
        setDisplayedMonth(today);
        setCalendarKey(Date.now());
      };
      reloadData();
      return () => {};
    }, [loadData, generateMarkedDates])
  );

  // Update cycle info when selected date changes
  useEffect(() => {
    setCycleDay(calculateCycleDay(selectedDate));
  }, [selectedDate, calculateCycleDay, setCycleDay]);

  // Update marked dates when base marked dates change (but not when selected date changes - handled in onDayPress)
  useEffect(() => {
    setMarkedDates(selectionMarkedDates);
  }, [selectionMarkedDates]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const onDayPress = useCallback(
    (day: DateData) => {
      const newDate = day.dateString;
      setSelectedDate(newDate);

      // Update cycle day and marked dates immediately to avoid delays
      setCycleDay(calculateCycleDay(newDate));
      setMarkedDates(getMarkedDatesWithSelection(newDate));

      openDrawer();
    },
    [calculateCycleDay, getMarkedDatesWithSelection, openDrawer, setCycleDay]
  );

  const onMonthChange = useCallback((month: DateData) => {
    setDisplayedMonth(month.dateString);
  }, []);

  // Function to check if the current displayed month is different from today's month
  const isTodayButtonVisible = useCallback(() => {
    // Extract year and month from today string (YYYY-MM-DD)
    const todayYear = currentDate.substring(0, 4);
    const todayMonth = currentDate.substring(5, 7);

    // Extract year and month from displayedMonth string (YYYY-MM-DD)
    const currentYear = displayedMonth.substring(0, 4);
    const currentMonth = displayedMonth.substring(5, 7);

    // Return true if they are different (button should be visible)
    return todayYear !== currentYear || todayMonth !== currentMonth;
  }, [currentDate, displayedMonth]);

  const goToToday = useCallback(() => {
    const today = formatDateString(new Date());
    setSelectedDate(today);
    setDisplayedMonth(today);
    setCalendarKey(Date.now());
    setCycleDay(calculateCycleDay(today));
    setMarkedDates(getMarkedDatesWithSelection(today));
  }, [getMarkedDatesWithSelection, calculateCycleDay, setCycleDay]);

  // Update header with Today button based on current month
  useEffect(() => {
    navigation.setOptions({
      headerRight: isTodayButtonVisible()
        ? () => (
            <TouchableOpacity onPress={goToToday}>
              <Text style={[styles.todayButtonText, { color: colors.primary }]}>
                Today
              </Text>
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [
    displayedMonth,
    navigation,
    colors.primary,
    goToToday,
    isTodayButtonVisible,
  ]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.calendarContainer}>
        <BaseCalendar
          mode="view"
          calendarKey={calendarKey}
          current={selectedDate}
          markedDates={markedDates}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          hideDayNames={true}
          calendarHeight={518}
        />
      </View>

      {isFocused && (
        <CalendarBottomSheet
          selectedDate={selectedDate}
          cycleDay={cycleDay}
          averageCycleLength={averageCycleLength}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 16,
  },
  calendarContainer: {
    flex: 1,
  },

});
