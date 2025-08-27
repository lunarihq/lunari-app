import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SymptomsTracker } from '../../components/SymptomsTracker';
import { LinkButton } from '../../components/LinkButton';
import { db, getSetting } from '../../db';
import { PeriodDate, periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { NotificationService } from '../../services/notificationService';

import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme } from '../styles/theme';
import DashedCircle from '../../components/DashedCircle';

const getFormattedDate = (date: Date): string =>
  `Today, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;

export default function Index() {
  const { colors } = useTheme();
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>(
    {}
  );
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [periodDayNumber, setPeriodDayNumber] = useState(0);
  const params = useLocalSearchParams();

  useEffect(() => {
    const setup = async () => {
      await loadSavedDates();
    };
    setup();

    const scheduleMidnightTick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const delay = next.getTime() - now.getTime();
      const timeoutId = setTimeout(() => {
        setCurrentDate(new Date());
        setInterval(() => setCurrentDate(new Date()), 24 * 60 * 60 * 1000);
      }, delay);
      return () => clearTimeout(timeoutId);
    };
    return scheduleMidnightTick();
  }, []);

  // Reload data whenever the screen is focused (after returning from period-calendar)
  useFocusEffect(
    useCallback(() => {
      const reloadData = async () => {
        await loadSavedDates();
      };
      reloadData();
      return () => {};
    }, [])
  );

  // Check if we should navigate to the period calendar (when coming from calendar screen)
  useEffect(() => {
    if (params.openPeriodModal === 'true') {
      router.push('/period-calendar');
    }
  }, [params.openPeriodModal]);

  const loadSavedDates = async () => {
    const saved = await db.select().from(periodDates);

    const dates = saved.reduce(
      (acc: { [key: string]: any }, curr: PeriodDate) => {
        acc[curr.date] = { selected: true, selectedColor: '#FF597B' };
        return acc;
      },
      {} as { [key: string]: any }
    );

    setSelectedDates(dates);

    if (saved.length > 0) {
      // Use the service to group dates into periods
      const sortedDates = saved.map(s => s.date);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period

      setFirstPeriodDate(mostRecentStart);
      setCurrentCycleDay(
        PeriodPredictionService.getCurrentCycleDay(mostRecentStart)
      );

      // Calculate if today is a period day
      const periodDayResult = PeriodPredictionService.calculatePeriodDay(dates);
      setIsPeriodDay(periodDayResult.isPeriodDay);
      setPeriodDayNumber(periodDayResult.dayNumber);

      // Schedule period notifications if enabled
      try {
        // The schedulePeriodReminder function will check if notifications are enabled
        await NotificationService.schedulePeriodReminder(
          mostRecentStart,
          sortedDates
        );
      } catch (error) {
        console.error(
          'Failed to schedule period notifications on app load:',
          error
        );
      }
    } else {
      // Explicitly set to null when no data exists
      setFirstPeriodDate(null);
      setCurrentCycleDay(null);
      setIsPeriodDay(false);
      setPeriodDayNumber(0);
    }
  };

  // Update period day check when current date changes
  useEffect(() => {
    const periodDayResult =
      PeriodPredictionService.calculatePeriodDay(selectedDates);
    setIsPeriodDay(periodDayResult.isPeriodDay);
    setPeriodDayNumber(periodDayResult.dayNumber);
  }, [currentDate, selectedDates]);

  const [userCycleLength, setUserCycleLength] = useState<number>(28);

  const prediction = firstPeriodDate
    ? PeriodPredictionService.getPrediction(
        firstPeriodDate,
        Object.keys(selectedDates),
        userCycleLength
      )
    : null;

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const cycleLength = await getSetting('userCycleLength');
        if (cycleLength) {
          setUserCycleLength(parseInt(cycleLength, 10));
        }
      } catch {}
    };
    loadUserSettings();
  }, []);

  const averageCycleLength =
    Object.keys(selectedDates).length > 0
      ? PeriodPredictionService.getAverageCycleLength(
          Object.keys(selectedDates),
          userCycleLength
        )
      : userCycleLength;

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={defaultTheme.globalStyles.predictionCard}>
        <View style={defaultTheme.globalStyles.predictionOuterCircle}>
          <DashedCircle
            size={350}
            strokeWidth={3}
            dashLength={3}
            dashCount={120}
          />
          <View
            style={[
              defaultTheme.globalStyles.predictionInnerCircle,
              { backgroundColor: colors.background },
            ]}
          >
            {isPeriodDay ? (
              <>
                <Text
                  style={[styles.currentDay, { color: colors.textPrimary }]}
                >
                  {getFormattedDate(currentDate)}
                </Text>
                <Text
                  style={[
                    defaultTheme.globalStyles.predictionLabel,
                    { color: colors.textPrimary },
                  ]}
                >
                  Period
                </Text>
                <Text
                  style={[
                    defaultTheme.globalStyles.predictionDays,
                    { color: colors.textPrimary },
                  ]}
                >
                  Day {periodDayNumber}
                </Text>
              </>
            ) : prediction ? (
              <>
                <Text
                  style={[styles.currentDay, { color: colors.textPrimary }]}
                >
                  {getFormattedDate(currentDate)}
                </Text>
                {prediction.days > 0 ? (
                  <>
                    <Text
                      style={[
                        defaultTheme.globalStyles.predictionLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Expected period in
                    </Text>
                    <Text
                      style={[
                        defaultTheme.globalStyles.predictionDays,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {prediction.days} {prediction.days === 1 ? 'day' : 'days'}
                    </Text>
                  </>
                ) : prediction.days === 0 ? (
                  <Text
                    style={[
                      defaultTheme.globalStyles.predictionStatus,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Your period is expected today
                  </Text>
                ) : (
                  <>
                    <Text
                      style={[
                        defaultTheme.globalStyles.predictionLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Late for
                    </Text>
                    <Text
                      style={[
                        defaultTheme.globalStyles.predictionDays,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {Math.abs(prediction.days)}{' '}
                      {Math.abs(prediction.days) === 1 ? 'day' : 'days'}
                    </Text>
                    <LinkButton
                      title="Learn about late periods"
                      onPress={() => router.push('/late-period-info')}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <Text
                  style={[styles.currentDay, { color: colors.textPrimary }]}
                >
                  {getFormattedDate(currentDate)}
                </Text>
                <Text
                  style={[styles.emptyStateText, { color: colors.textPrimary }]}
                >
                  Log the first day of your last period for next prediction.
                </Text>
              </>
            )}
            <Pressable
              onPress={() => router.push('/period-calendar')}
              style={defaultTheme.globalStyles.primaryButton}
            >
              <Text style={defaultTheme.globalStyles.buttonText}>
                {Object.keys(selectedDates).length > 0
                  ? 'Edit period dates'
                  : 'Log period'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.insightsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.insightsTitleContainer}>
          <Text style={[styles.insightsTitle, { color: colors.textPrimary }]}>
            Today's insights
          </Text>
          <Pressable
            onPress={() =>
              currentCycleDay &&
              router.push(
                `/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
              )
            }
            disabled={!currentCycleDay}
            style={[
              styles.chevronButton,
              !currentCycleDay && styles.chevronDisabled,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentCycleDay ? colors.textPrimary : colors.textMuted}
            />
          </Pressable>
        </View>
        {currentCycleDay ? (
          <View style={styles.insightsRow}>
            <Pressable
              style={[
                styles.insightCard,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() =>
                currentCycleDay &&
                router.push(
                  `/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
                )
              }
            >
              <View style={styles.insightTop}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.textPrimary}
                  style={styles.insightIcon}
                />
                <Text
                  style={[styles.insightLabel, { color: colors.textPrimary }]}
                >
                  Cycle day
                </Text>
              </View>
              <View
                style={[
                  styles.insightValueContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[styles.insightValue, { color: colors.textPrimary }]}
                >
                  {currentCycleDay || '-'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.insightCard,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() =>
                currentCycleDay &&
                router.push(
                  `/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
                )
              }
            >
              <View style={styles.insightTop}>
                <Ionicons
                  name="sync-outline"
                  size={24}
                  color={colors.textPrimary}
                  style={styles.insightIcon}
                />
                <Text
                  style={[styles.insightLabel, { color: colors.textPrimary }]}
                >
                  Cycle phase
                </Text>
              </View>
              <View
                style={[
                  styles.insightValueContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[styles.insightValue, { color: colors.textPrimary }]}
                >
                  {currentCycleDay
                    ? PeriodPredictionService.getCyclePhase(
                        currentCycleDay,
                        averageCycleLength
                      )
                    : '-'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.insightCard,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() =>
                currentCycleDay &&
                router.push(
                  `/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
                )
              }
            >
              <View style={styles.insightTop}>
                <Ionicons
                  name="leaf-outline"
                  size={24}
                  color={colors.textPrimary}
                  style={styles.insightIcon}
                />
                <Text
                  style={[styles.insightLabel, { color: colors.textPrimary }]}
                >
                  Chance to
                </Text>
                <Text
                  style={[styles.insightLabel, { color: colors.textPrimary }]}
                >
                  conceive
                </Text>
              </View>
              <View
                style={[
                  styles.insightValueContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[styles.insightValue, { color: colors.textPrimary }]}
                >
                  {currentCycleDay
                    ? PeriodPredictionService.getPregnancyChance(
                        currentCycleDay,
                        averageCycleLength
                      )
                    : '-'}
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <Text style={[styles.insightsText, { color: colors.textPrimary }]}>
            Please log at least one period to view your cycle insights.
          </Text>
        )}
      </View>

      <SymptomsTracker />

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  insightsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  insightsText: {
    fontSize: 16,
    lineHeight: 18,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  insightCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
  },
  insightIcon: {
    marginBottom: 6,
  },
  insightLabel: {
    fontSize: 15,
    color: '#332F49',
    textAlign: 'center',
    lineHeight: 18,
  },
  insightValueContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  insightTop: {
    alignItems: 'center',
    width: '100%',
  },
  currentDay: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  chevronButton: {
    padding: 4,
    borderRadius: 4,
  },
  chevronDisabled: {
    opacity: 0.5,
  },
});
