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
import DashedCircle from '../components/DashedCircle';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
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



  const loadSavedDates = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: { [key: string]: any }, curr: PeriodDate) => { 
      acc[curr.date] = { selected: true, selectedColor: '#FF597B' };
      return acc;
    }, {} as { [key: string]: any });
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      // Use the service to group dates into periods
      const sortedDates = saved.map(s => s.date);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
      
      setFirstPeriodDate(mostRecentStart);
      setCurrentCycleDay(PeriodPredictionService.getCurrentCycleDay(mostRecentStart));
      
      // Calculate if today is a period day
      const periodDayResult = PeriodPredictionService.calculatePeriodDay(dates);
      setIsPeriodDay(periodDayResult.isPeriodDay);
      setPeriodDayNumber(periodDayResult.dayNumber);
      
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
        
        // Use the service to group dates into periods
        const sortedDates = Object.keys(dates);
        const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

        const mostRecentPeriod = periods[0];
        const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1];
        
        setSelectedDates(dates);
        setFirstPeriodDate(mostRecentStart);
        setCurrentCycleDay(PeriodPredictionService.getCurrentCycleDay(mostRecentStart));
        
        // Calculate if today is a period day after saving
        const periodDayResult = PeriodPredictionService.calculatePeriodDay(dates);
        setIsPeriodDay(periodDayResult.isPeriodDay);
        setPeriodDayNumber(periodDayResult.dayNumber);
        
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
    const periodDayResult = PeriodPredictionService.calculatePeriodDay(selectedDates);
    setIsPeriodDay(periodDayResult.isPeriodDay);
    setPeriodDayNumber(periodDayResult.dayNumber);
  }, [currentDate]);

  const prediction = firstPeriodDate 
    ? PeriodPredictionService.getPrediction(firstPeriodDate, Object.keys(selectedDates))
    : null;

  const averageCycleLength = Object.keys(selectedDates).length > 0 
    ? PeriodPredictionService.getAverageCycleLength(Object.keys(selectedDates))
    : 28;

  return (

      <ScrollView style={theme.globalStyles.container} showsVerticalScrollIndicator={false}>
        <View style={theme.globalStyles.predictionCard}>
          <View style={theme.globalStyles.predictionOuterCircle}>
            <DashedCircle size={350} strokeWidth={3} dashLength={3} dashCount={120} />
            <View style={theme.globalStyles.predictionInnerCircle}>
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
        </View>

        <View style={styles.insightsCard}>
          <View style={styles.insightsTitleContainer}>
            <Text style={styles.insightsTitle}>Today's insights</Text>
            <Pressable
              onPress={() => currentCycleDay && router.push(`/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`)}
              disabled={!currentCycleDay}
              style={[styles.chevronButton, !currentCycleDay && styles.chevronDisabled]}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentCycleDay ? "#332F49" : "#B0B0B0"} 
              />
            </Pressable>
          </View>
          {currentCycleDay ? (
            <View style={styles.insightsRow}>
              <Pressable 
                style={[styles.insightCard, styles.cardBlue]}
                onPress={() => currentCycleDay && router.push(`/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`)}
              >
                <View style={styles.insightTop}>
                  <Ionicons name="calendar-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Cycle day</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay || '-'}
                  </Text>
                </View>
              </Pressable>
              
              <Pressable 
                style={[styles.insightCard, styles.cardYellow]}
                onPress={() => currentCycleDay && router.push(`/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`)}
              >
                <View style={styles.insightTop}>
                  <Ionicons name="sync-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Cycle phase</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay ? PeriodPredictionService.getCyclePhase(currentCycleDay, averageCycleLength) : '-'}
                  </Text>
                </View>
              </Pressable>
              
              <Pressable 
                style={[styles.insightCard, styles.cardPink]}
                onPress={() => currentCycleDay && router.push(`/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`)}
              >
                <View style={styles.insightTop}>
                  <Ionicons name="leaf-outline" size={24} color="#332F49" style={styles.insightIcon} />
                  <Text style={styles.insightLabel}>Chance to</Text>
                  <Text style={styles.insightLabel}>conceive</Text>
                </View>
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {currentCycleDay ? PeriodPredictionService.getPregnancyChance(currentCycleDay, averageCycleLength) : '-'}
                  </Text>
                </View>
              </Pressable>
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
    backgroundColor: '#E9F0FF',
    borderWidth: 1,
    borderColor: '#4F5FEB',
  },
  cardYellow: {
    backgroundColor: '#E9F0FF',
    borderWidth: 1,
    borderColor: '#4F5FEB',
  },
  cardPink: {
    backgroundColor: '#E9F0FF',
    borderWidth: 1,
    borderColor: '#4F5FEB',
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
    backgroundColor: '#ffffff',
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
  chevronButton: {
    padding: 4,
    borderRadius: 4,
  },
  chevronDisabled: {
    opacity: 0.5,
  },
});
