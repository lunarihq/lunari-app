import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { db, getSetting } from '../../db';
import { periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { StatCard } from '../../components/StatCard';
import { CycleHistory } from '../../components/CycleHistory';
import { DropIcon } from '../../components/icons/Drop';
import { getCycleStatus, getPeriodStatus } from '../../utils/cycleUtils';
import defaultTheme, { useTheme } from '../styles/theme';
interface CycleData {
  startDate: string;
  cycleLength: string | number;
  periodLength: number;
}

interface HistoryEntryWithDate extends CycleData {
  originalDate: string;
}

export default function Stats() {
  const { colors } = useTheme();
  const [averageCycleLength, setAverageCycleLength] = useState<number>(0);
  const [averagePeriodLength, setAveragePeriodLength] = useState<number>(0);
  const [cycleHistory, setCycleHistory] = useState<CycleData[]>([]);
  const [userCycleLength, setUserCycleLength] = useState<number>(28);
  const [hasNoPeriodData, setHasNoPeriodData] = useState<boolean>(false);

  const loadStatistics = useCallback(async () => {
    try {
      // Load period dates from the database
      const saved = await db.select().from(periodDates);

      if (saved.length === 0) {
        // Reset all states when there are no period dates
        setAverageCycleLength(0);
        setAveragePeriodLength(0);
        setCycleHistory([]);
        setHasNoPeriodData(true);
        return;
      }

      // We have period data, so hide empty state
      setHasNoPeriodData(false);

      const sortedDates = saved.map(s => s.date);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Calculate average cycle length
      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        sortedDates,
        userCycleLength
      );
      setAverageCycleLength(cycleLength);

      // Calculate average period length
      const periodLengths = periods.map(period => period.length);
      const totalPeriodLength = periodLengths.reduce(
        (sum, length) => sum + length,
        0
      );
      const avgPeriodLength = Math.round(
        totalPeriodLength / periodLengths.length
      );
      setAveragePeriodLength(avgPeriodLength);

      // Generate cycle history data
      const history: HistoryEntryWithDate[] = [];

      // console.log removed

      // The periods array is in descending order (newest to oldest)
      // We need to reverse it to get chronological order (oldest to newest)
      const chronologicalPeriods = [...periods].reverse();

      // console.log removed

      // Create an array of period start dates (first day of each period)
      const periodStartDates = chronologicalPeriods.map(period => {
        const sortedPeriod = [...period].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        return sortedPeriod[0];
      });

      // Sort period start dates in chronological order (oldest to newest)
      periodStartDates.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      // console.log removed

      // For each period, calculate its data
      for (let i = 0; i < chronologicalPeriods.length; i++) {
        const period = chronologicalPeriods[i];
        // Get the start date for this period
        const sortedPeriod = [...period].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        const startDate = sortedPeriod[0];

        // Calculate cycle length
        let cycleLengthValue: string | number;

        // Check if this is the most recent period (last in the array after sorting)
        if (i === chronologicalPeriods.length - 1) {
          cycleLengthValue = 'In progress';
        } else {
          const currentStartDate = periodStartDates[i];
          const nextStartDate = periodStartDates[i + 1];

          const daysBetween = Math.round(
            Math.abs(
              (new Date(nextStartDate).getTime() -
                new Date(currentStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          cycleLengthValue = daysBetween;
        }

        // Add to history with the original date for sorting
        const historyEntry = {
          startDate: formatDate(startDate),
          originalDate: startDate, // Store original date for sorting
          cycleLength: cycleLengthValue,
          periodLength: period.length,
        };
        history.push(historyEntry);
      }

      // Sort history from most recent to oldest
      history.sort((a, b) => {
        const dateA = new Date(a.originalDate);
        const dateB = new Date(b.originalDate);
        return dateB.getTime() - dateA.getTime();
      });

      // Remove originalDate field before setting state
      const cleanHistory = history.map(({ originalDate, ...rest }) => rest);
      setCycleHistory(cleanHistory);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, [userCycleLength]);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
      return () => {};
    }, [loadStatistics])
  );

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const cycleLength = await getSetting('userCycleLength');
        if (cycleLength) {
          setUserCycleLength(parseInt(cycleLength, 10));
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    loadUserSettings();
  }, []);

  // Format date as "MMM DD" (e.g., "Apr 10")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Empty state component
  const renderEmptyState = () => (
    <View
      style={[styles.emptyStateContainer, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
        No period data yet
      </Text>
      <Text
        style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}
      >
        Log at least one cycle to see statistics and history.
      </Text>
      <Pressable
        onPress={() => router.push('/period-calendar')}
        style={[
          defaultTheme.globalStyles.primaryButton,
          styles.emptyStateButton,
        ]}
      >
        <Text style={defaultTheme.globalStyles.buttonText}>Log period</Text>
      </Pressable>
    </View>
  );

  // Show empty state if no period data
  if (hasNoPeriodData) {
    return (
      <ScrollView
        style={[
          defaultTheme.globalStyles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {renderEmptyState()}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[styles.myCyclesContainer, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Cycle statistics
        </Text>
        <View style={styles.cardsContainer}>
          <StatCard
            title="Average cycle length"
            value={`${averageCycleLength} days`}
            icon={<DropIcon size={32} color={colors.icon} />}
            status={getCycleStatus(averageCycleLength).status}
            type="cycle"
          />
          <StatCard
            title="Average period length"
            value={`${averagePeriodLength} days`}
            icon={<DropIcon size={32} color={colors.icon} />}
            status={getPeriodStatus(averagePeriodLength).status}
            type="period"
          />
        </View>
      </View>
      <CycleHistory cycles={cycleHistory} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  myCyclesContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
  },
  emptyStateContainer: {
    marginVertical: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  emptyStateButton: {
    minWidth: 120,
  },
});
