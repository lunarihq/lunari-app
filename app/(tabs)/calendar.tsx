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
} from 'react-native';
import { useTheme } from '../styles/theme';
import { DateData } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import { db, getSetting } from '../../db';
import { periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { BaseCalendar } from '../../components/BaseCalendar';
import { CalendarBottomSheet } from '../../components/CalendarBottomSheet';
import { MarkedDates, formatDateString } from '../types/calendarTypes';

export default function CalendarScreen() {
  const { colors } = useTheme();

  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [baseMarkedDates, setBaseMarkedDates] = useState<MarkedDates>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [allPeriodDates, setAllPeriodDates] = useState<string[]>([]);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);
  const [userCycleLength, setUserCycleLength] = useState<number>(28);
  const [userPeriodLength, setUserPeriodLength] = useState<number>(5);
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

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const cycleLength = await getSetting('userCycleLength');
        if (cycleLength) {
          setUserCycleLength(parseInt(cycleLength, 10));
        }

        const periodLength = await getSetting('userPeriodLength');
        if (periodLength) {
          setUserPeriodLength(parseInt(periodLength, 10));
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    loadUserSettings();
  }, []);

  // Check if we should navigate to the period calendar screen from URL params
  useEffect(() => {
    if (params.openPeriodModal === 'true') {
      router.push('/period-calendar');
    }
  }, [params.openPeriodModal]);

  // Helper function to get custom styles for different prediction types
  const getStylesForPredictionType = useCallback(
    (predictionType: string) => {
      switch (predictionType) {
        case 'ovulation':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
                borderWidth: 1.6,
                borderColor: colors.primary,
                borderStyle: 'dashed',
              },
              text: {
                color: colors.primary,
              },
            },
          };
        case 'fertile':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
              },
              text: {
                color: colors.primary,
              },
            },
          };
        case 'period':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: colors.accentPinkLight,
              },
              text: {
                color: colors.accentPink,
              },
            },
          };
        default:
          return {};
      }
    },
    [colors.primary, colors.accentPinkLight, colors.accentPink]
  );

  // Generate all marked dates including predictions
  const generateMarkedDates = useCallback(
    (periodDates: MarkedDates, startDate: string, allPeriods: string[][]) => {
      if (!startDate) return;

      const allMarkedDates = { ...periodDates };
      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        Object.keys(periodDates),
        userCycleLength
      );
      setAverageCycleLength(cycleLength);

      // Get all period start dates (earliest date in each period)
      const periodStartDates = allPeriods.map(
        period => period[period.length - 1]
      );

      // Generate fertile windows and ovulation for all logged periods (past and present)
      const fertilityDates =
        PeriodPredictionService.generateFertilityForLoggedPeriods(
          periodStartDates,
          cycleLength
        );

      // Get predicted dates for future cycles
      const predictedDates = PeriodPredictionService.generatePredictedDates(
        startDate,
        cycleLength,
        userPeriodLength,
        12
      );

      // Apply styling to fertility dates (past and present cycles)
      Object.entries(fertilityDates).forEach(([dateString, prediction]) => {
        // Only apply fertility style if this is not an actual period date
        if (
          !allMarkedDates[dateString] ||
          !allMarkedDates[dateString].selected
        ) {
          const styles = getStylesForPredictionType(prediction.type);
          if (Object.keys(styles).length > 0) {
            allMarkedDates[dateString] = styles;
          }
        }
      });

      // Apply styling to predicted dates (future cycles only)
      Object.entries(predictedDates).forEach(([dateString, prediction]) => {
        // Only apply prediction style if this is not an actual period date and not already a fertility date
        if (
          !allMarkedDates[dateString] ||
          !allMarkedDates[dateString].selected
        ) {
          const styles = getStylesForPredictionType(prediction.type);
          if (Object.keys(styles).length > 0) {
            allMarkedDates[dateString] = styles;
          }
        }
      });

      // Store base marked dates (without selection highlight)
      setBaseMarkedDates(allMarkedDates);
    },
    [userCycleLength, userPeriodLength, getStylesForPredictionType]
  );

  // Load period dates from database
  const loadData = useCallback(async () => {
    const saved = await db.select().from(periodDates);

    const dates = saved.reduce((acc: MarkedDates, curr) => {
      acc[curr.date] = {
        selected: true,
        customStyles: {
          container: {
            backgroundColor: colors.accentPink,
            borderRadius: 16,
          },
          text: {
            color: colors.white,
          },
        },
      };
      return acc;
    }, {} as MarkedDates);

    if (saved.length > 0) {
      const sortedDates = saved.map(s => s.date);
      setAllPeriodDates(sortedDates);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period

      setFirstPeriodDate(mostRecentStart);

      // Generate predictions and marked dates
      generateMarkedDates(dates, mostRecentStart, periods);
    } else {
      setFirstPeriodDate(null);
      setAllPeriodDates([]);
      setCycleDay(null);
      setMarkedDates({});
    }
  }, [colors.accentPink, colors.white, generateMarkedDates]);

  // Calculate cycle day for a given date
  const calculateCycleDay = useCallback(
    (date: string): number | null => {
      if (!firstPeriodDate || allPeriodDates.length === 0) return null;

      const selectedDateObj = new Date(date);
      const startDateObj = new Date(firstPeriodDate);

      // If the selected date is in the current cycle or future, use the current cycle start
      if (selectedDateObj >= startDateObj) {
        const cycleInfo = PeriodPredictionService.getCycleInfo(
          firstPeriodDate,
          date
        );
        return cycleInfo.cycleDay;
      }

      // For dates before the current cycle, find the appropriate cycle start date
      const periods =
        PeriodPredictionService.groupDateIntoPeriods(allPeriodDates);
      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        allPeriodDates,
        userCycleLength
      );

      // Find which cycle contains the target date
      for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        const periodStart = period[period.length - 1]; // Earliest date in the period
        const periodEnd = period[0]; // Latest date in the period

        // If target date is within this period, calculate cycle day from this period start
        if (date >= periodStart && date <= periodEnd) {
          const cycleInfo = PeriodPredictionService.getCycleInfo(
            periodStart,
            date
          );
          return cycleInfo.cycleDay;
        }

        // If target date is before this period, check if it's in the previous cycle
        if (date < periodStart) {
          // Calculate the previous cycle start date
          const prevCycleStart = new Date(periodStart);
          prevCycleStart.setDate(prevCycleStart.getDate() - cycleLength);
          const prevCycleStartStr = formatDateString(prevCycleStart);

          // If target date is after the previous cycle start, it's in that cycle
          if (date >= prevCycleStartStr) {
            const cycleInfo = PeriodPredictionService.getCycleInfo(
              prevCycleStartStr,
              date
            );
            return cycleInfo.cycleDay;
          }
        }
      }

      return null;
    },
    [firstPeriodDate, allPeriodDates, userCycleLength]
  );

  // Update cycle day info for selected date
  const updateSelectedDateInfo = useCallback(
    (date: string) => {
      setCycleDay(calculateCycleDay(date));
    },
    [calculateCycleDay]
  );

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = useCallback(
    (selectedDateParam: string) => {
      const updatedMarkedDates = { ...baseMarkedDates };
      const isPeriodDate =
        updatedMarkedDates[selectedDateParam]?.customStyles?.container
          ?.backgroundColor === colors.accentPink;

      if (isPeriodDate) {
        // For period dates, preserve the pink background but add a grey background behind it
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: colors.primary,
              borderRadius: 16, // Keep the original size for the pink circle
              width: 32, // Keep the original size for the pink circle
              height: 32, // Keep the original size for the pink circle
            },
            text: { color: colors.white },
          },
        };
      } else {
        // For non-period dates, just add the grey background
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: '#E2E5EF',
              borderRadius: 20, // Bigger circle
              width: 40, // Make it bigger
              height: 40, // Make it bigger
            },
            text: updatedMarkedDates[selectedDateParam]?.customStyles?.text,
          },
        };
      }

      return updatedMarkedDates;
    },
    [baseMarkedDates, colors.accentPink, colors.primary, colors.white]
  );

  const selectionMarkedDates = useMemo(
    () =>
      selectedDate
        ? getMarkedDatesWithSelection(selectedDate)
        : baseMarkedDates,
    [baseMarkedDates, selectedDate, getMarkedDatesWithSelection]
  );

  // Reload data when tab is focused
  useFocusEffect(
    useCallback(() => {
      const reloadData = async () => {
        await loadData();
        const today = formatDateString(new Date());
        setSelectedDate(today);
        setDisplayedMonth(today);
        setCalendarKey(Date.now());
      };
      reloadData();
      return () => {};
    }, [loadData])
  );

  // Update cycle info when selected date changes
  useEffect(() => {
    updateSelectedDateInfo(selectedDate);
  }, [selectedDate, firstPeriodDate, allPeriodDates, updateSelectedDateInfo]);

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
    [calculateCycleDay, getMarkedDatesWithSelection, openDrawer]
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
    setCalendarKey(Date.now()); // Force calendar to reposition to today without remounting BaseCalendar
    updateSelectedDateInfo(today);
    setMarkedDates(getMarkedDatesWithSelection(today));
  }, [getMarkedDatesWithSelection, updateSelectedDateInfo]);

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

      <CalendarBottomSheet
        selectedDate={selectedDate}
        cycleDay={cycleDay}
        averageCycleLength={averageCycleLength}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
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
