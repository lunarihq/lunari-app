import React from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { SymptomsTracker } from '../components/SymptomsTracker';
import { db } from '../../db';
import { PeriodDate, periodDates} from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { NotificationService } from '../../services/notificationService';
import { validatePeriodDate } from '../../validation/periodData';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
};

const getPregnancyChance = (cycleDay: number): string => {
  if (cycleDay >= 11 && cycleDay <= 17) return 'High';
  if (cycleDay >= 8 && cycleDay <= 20) return 'Medium';
  return 'Low';
};

const getOvulationDay = (startDate: string): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString();
};

const getAverageCycleLength = (dates: string[]): number => {
  if (dates.length < 2) return 28;
  
  const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const periods: string[][] = [];
  let currentPeriod: string[] = [sortedDates[0]];

  // First group consecutive days into periods
  for (let i = 1; i < sortedDates.length; i++) {
    const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 7) {
      currentPeriod.push(sortedDates[i]);
    } else {
      periods.push(currentPeriod);
      currentPeriod = [sortedDates[i]];
    }
  }
  periods.push(currentPeriod);

  // Then calculate gaps between periods using their first days
  let weightedTotal = 0;
  let weightSum = 0;
  let cycles = 0;

  for (let i = 1; i < Math.min(periods.length, 6); i++) {
    const currentPeriodStart = new Date(periods[i-1][periods[i-1].length-1]);
    const prevPeriodStart = new Date(periods[i][periods[i].length-1]);
    
    const dayDiff = Math.floor(
      (currentPeriodStart.getTime() - prevPeriodStart.getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    
    const weight = Math.max(1 - ((cycles) * 0.2), 0.2);
    weightedTotal += dayDiff * weight;
    weightSum += weight;
    cycles++;
  }
  
  return cycles > 0 ? Math.round(weightedTotal / weightSum) : 28;
};

const getNextPeriodPrediction = (startDate: string, allDates: string[]): { days: number; date: string } => {
  const cycleLength = getAverageCycleLength(allDates);
  const today = new Date();
  const nextPeriod = new Date(startDate);
  
  console.log('Cycle length:', cycleLength);
  console.log('Start date:', startDate);
  console.log('Today:', today.toISOString());
  
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  console.log('Next period:', nextPeriod.toISOString());
  
  const daysUntil = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  console.log('Days until:', daysUntil);
  
  return { days: daysUntil, date: nextPeriod.toLocaleDateString() };
};

const getCyclePhase = (cycleDay: number): string => {
  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 10) return 'Follicular';
  if (cycleDay <= 14) return 'Ovulatory';
  if (cycleDay <= 28) return 'Luteal';
  return 'Extended';
};

const getPhaseDescription = (phase: string): string => {
  switch (phase) {
    case 'Menstrual':
      return 'Your period is happening. You might experience cramps, fatigue, and mood changes. Focus on rest and self-care.';
    case 'Follicular':
      return 'Energy levels start to rise with increasing estrogen. Good time for starting new projects and physical activity.';
    case 'Ovulatory':
      return 'Peak fertility window. You might notice increased energy, better mood, and heightened sex drive.';
    case 'Luteal':
      return 'Progesterone rises. You might experience PMS symptoms like bloating or mood changes. Focus on gentle exercise and comfort.';
    case 'Extended':
      return 'Your cycle has gone longer than typical. Consider tracking any symptoms and consulting your healthcare provider if this persists.';
    default:
      return '';
  }
};

export default function Index() {
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [periodDayNumber, setPeriodDayNumber] = useState(0);
  const params = useLocalSearchParams();

  useEffect(() => {
    const setup = async () => {
      await loadSavedDates();
    };
    setup();

    // Update date every day at midnight
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(timer);
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

  const calculateCurrentCycleDay = (dates: string[]) => {
    if (dates.length === 0) return null;
    
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const mostRecentStart = new Date(sortedDates[0]);
    const today = new Date();
    
    const diffTime = today.getTime() - mostRecentStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  const calculatePeriodDay = (dates: { [date: string]: any }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if today is a period day
    if (dates[todayStr]) {
      // It's a period day, now calculate which day it is
      let dayCount = 1;
      const tempDate = new Date(todayStr);
      
      // Look back day by day to find consecutive period days
      while (true) {
        tempDate.setDate(tempDate.getDate() - 1);
        const prevDateStr = tempDate.toISOString().split('T')[0];
        
        if (dates[prevDateStr]) {
          dayCount++;
        } else {
          break;
        }
      }
      
      setIsPeriodDay(true);
      setPeriodDayNumber(dayCount);
    } else {
      setIsPeriodDay(false);
      setPeriodDayNumber(0);
    }
  };

  const loadSavedDates = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: { [key: string]: any }, curr: PeriodDate) => { 
      acc[curr.date] = { selected: true, selectedColor: '#FF597B' };
      return acc;
    }, {} as { [key: string]: any });
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      // Sort dates in ascending order for grouping
      const sortedDates = saved.map(s => s.date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Changed to descending order
      
      const periods: string[][] = [];
      let currentPeriod: string[] = [sortedDates[0]];

      for (let i = 1; i < sortedDates.length; i++) {
        const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 7) {
          currentPeriod.push(sortedDates[i]);
        } else {
          periods.push(currentPeriod);
          currentPeriod = [sortedDates[i]];
        }
      }
      periods.push(currentPeriod);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0]; // Changed to first period since we sorted in descending order
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
      
      setFirstPeriodDate(mostRecentStart);
      setCurrentCycleDay(calculateCurrentCycleDay([mostRecentStart]));
      
      // Calculate if today is a period day
      calculatePeriodDay(dates);
      
      // Schedule period notifications if enabled
      try {
        // The schedulePeriodReminder function will check if notifications are enabled
        await NotificationService.schedulePeriodReminder(mostRecentStart, sortedDates);
      } catch (error) {
        console.error('Failed to schedule period notifications on app load:', error);
      }
    } else {
      // Explicitly set to null when no data exists
      setFirstPeriodDate(null);
      setCurrentCycleDay(null);
      setIsPeriodDay(false);
      setPeriodDayNumber(0);
    }
  };

  const savePeriodDates = async (dates: { [date: string]: any }) => {
    try {
      // Validate dates before saving
      if (!Object.keys(dates).every(date => validatePeriodDate(date))) {
        console.error('Invalid dates detected');
        return;
      }
      
      await db.delete(periodDates);
      
      const dateInserts = Object.keys(dates).map(date => ({
        date
      }));
      
      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
        
        // Use the same logic as loadSavedDates to find the most recent period
        const sortedDates = Object.keys(dates)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
        const periods: string[][] = [];
        let currentPeriod: string[] = [sortedDates[0]];

        for (let i = 1; i < sortedDates.length; i++) {
          const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff <= 7) {
            currentPeriod.push(sortedDates[i]);
          } else {
            periods.push(currentPeriod);
            currentPeriod = [sortedDates[i]];
          }
        }
        periods.push(currentPeriod);

        const mostRecentPeriod = periods[0];
        const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1];
        
        setSelectedDates(dates);
        setFirstPeriodDate(mostRecentStart);
        setCurrentCycleDay(calculateCurrentCycleDay([mostRecentStart]));
        
        // Calculate if today is a period day after saving
        calculatePeriodDay(dates);
        
        // Schedule period notifications if enabled
        try {
          // The schedulePeriodReminder function will check if notifications are enabled
          await NotificationService.schedulePeriodReminder(mostRecentStart, sortedDates);
        } catch (error) {
          console.error('Failed to schedule period notifications:', error);
        }
      } else {
        setSelectedDates({});
        setFirstPeriodDate(null);
        setCurrentCycleDay(null);
        setIsPeriodDay(false);
        setPeriodDayNumber(0);
        
        // Cancel period notifications
        try {
          await NotificationService.cancelPeriodNotifications();
        } catch (error) {
          console.error('Failed to cancel period notifications:', error);
        }
      }
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  // Update period day check when current date changes
  useEffect(() => {
    calculatePeriodDay(selectedDates);
  }, [currentDate]);

  const prediction = firstPeriodDate 
    ? PeriodPredictionService.getPrediction(firstPeriodDate, Object.keys(selectedDates))
    : null;

  return (

      <ScrollView style={theme.globalStyles.container} showsVerticalScrollIndicator={false}>
        <View style={theme.globalStyles.predictionCard}>
          <View style={theme.globalStyles.predictionCircle}>
            {isPeriodDay ? (
              <>
                <Text style={styles.currentDay}>{getFormattedDate(currentDate)}</Text>
                <Text style={theme.globalStyles.predictionLabel}>Period</Text>
                <Text style={theme.globalStyles.predictionDays}>Day {periodDayNumber}</Text>
              </>
            ) : prediction ? (
              <>
                <Text style={styles.currentDay}>{getFormattedDate(currentDate)}</Text>
                {prediction.days > 0 ? (
                  <>
                    <Text style={theme.globalStyles.predictionLabel}>Expected period in</Text>
                    <Text style={theme.globalStyles.predictionDays}>{prediction.days} {prediction.days === 1 ? 'day' : 'days'}</Text>
                  </>
                ) : prediction.days === 0 ? (
                  <>
                    <Text style={theme.globalStyles.predictionLabel}>Your period is</Text>
                    <Text style={theme.globalStyles.predictionDays}>expected today</Text>
                  </>
                ) : (
                  <>
                      <Text style={theme.globalStyles.predictionLabel}>Late for</Text>
                    <Text style={theme.globalStyles.predictionDays}>{Math.abs(prediction.days)} {Math.abs(prediction.days) === 1 ? 'day' : 'days'}</Text>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={styles.currentDay}>{getFormattedDate(currentDate)}</Text>
                <Text style={styles.emptyStateText}>Log the first day of your last period for next prediction.</Text>
              </>
            )}
            <Pressable onPress={() => router.push('/period-calendar')} style={theme.globalStyles.button}>
              <Text style={theme.globalStyles.buttonText}>
                {Object.keys(selectedDates).length > 0 
                  ? "Edit period dates"
                  : "Log period"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.insightsCard}>
          <View style={styles.insightsTitleContainer}>
            <Text style={styles.insightsTitle}>Today's insights</Text>
            <Ionicons name="chevron-forward" size={24} color="#332F49" />
          </View>
          {currentCycleDay ? (
            <View style={styles.insightsRow}>
              <View style={[styles.insightCard, styles.cardBlue]}>
                <View style={styles.insightTop}>
                  <Ionicons name="calendar-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Cycle day</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay || '-'}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.insightCard, styles.cardYellow]}>
                <View style={styles.insightTop}>
                  <Ionicons name="sync-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Cycle phase</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay ? getCyclePhase(currentCycleDay) : '-'}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.insightCard, styles.cardPink]}>
                <View style={styles.insightTop}>
                  <Ionicons name="leaf-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Chance to</Text>
                  <Text style={styles.insightLabel}>conceive</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay ? getPregnancyChance(currentCycleDay) : '-'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.insightsText}>
              Please log at least one period to view your cycle insights.
            </Text>
          )}
        </View>

        <SymptomsTracker />
        
        <View />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  insightsCard: {
    backgroundColor: '#fff',
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
    color: '#332F49',
  },
  insightsText: {
    color: '#332F49',
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

    paddingVertical: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
  },
  cardBlue: {
    backgroundColor: '#D5D9FF',
  },
  cardYellow: {
    backgroundColor: '#BBFFE5',
  },
  cardPink: {
    backgroundColor: '#FFE9FB',
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
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
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
    color: '#332F49',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 26,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  insightTop: {
    alignItems: 'center',
    width: '100%',
  },
  currentDay: {
    fontSize: 17,
    fontWeight: '500',
    color: '#332F49',
    marginBottom: 24,
  },
});
