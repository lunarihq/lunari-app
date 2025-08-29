import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SymptomsTracker } from './SymptomsTracker';
import { LinkButton } from './LinkButton';
import DashedCircle from './DashedCircle';
import { DropIcon } from './icons/Drop';
import { PeriodPredictionService } from '../services/periodPredictions';
import defaultTheme, { useTheme } from '../app/styles/theme';
import { Colors } from '../app/styles/colors';

interface CycleOverviewWidgetProps {
  currentDate: Date;
  isPeriodDay: boolean;
  periodDayNumber: number;
  prediction: any;
  selectedDates: { [date: string]: any };
  currentCycleDay: number | null;
  averageCycleLength: number;
}

const getFormattedDate = (date: Date): string =>
  `Today, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;

export function CycleOverviewWidget({
  currentDate,
  isPeriodDay,
  periodDayNumber,
  prediction,
  selectedDates,
  currentCycleDay,
  averageCycleLength,
}: CycleOverviewWidgetProps) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.predictionCard}>
        <View style={styles.predictionOuterCircle}>
          <DashedCircle
            size={350}
            strokeWidth={3}
            dashLength={3}
            dashCount={120}
          />
          <View
            style={[
              styles.predictionInnerCircle,
              { backgroundColor: colors.predictionCircleBackground },
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
                    styles.predictionLabel,
                    { color: colors.textPrimary },
                  ]}
                >
                  Period
                </Text>
                <Text
                  style={[
                    styles.predictionDays,
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
                        styles.predictionLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Expected period in
                    </Text>
                    <Text
                      style={[
                        styles.predictionDays,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {prediction.days} {prediction.days === 1 ? 'day' : 'days'}
                    </Text>
                  </>
                ) : prediction.days === 0 ? (
                  <Text
                    style={[
                      styles.predictionStatus,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Your period is expected today
                  </Text>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.predictionLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Late for
                    </Text>
                    <Text
                      style={[
                        styles.predictionDays,
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
              style={[defaultTheme.globalStyles.primaryButton, { marginVertical: 16 }]}
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
                  backgroundColor: colors.background,
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
                <View style={styles.insightIconContainer}>
                  <DropIcon
                    size={24}
                    color={colors.textPrimary}
                  />
                </View>
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
                  backgroundColor: colors.background,
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
                <View style={styles.insightIconContainer}>
                  <DropIcon
                    size={24}
                    color={colors.textPrimary}
                  />
                </View>
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
                  backgroundColor: colors.background,
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
                <View style={styles.insightIconContainer}>
                  <DropIcon
                    size={24}
                    color={colors.textPrimary}
                  />
                </View>
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
    </>
  );
}

const styles = StyleSheet.create({
  predictionCard: {
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: 'red',
  },
  predictionOuterCircle: {
    width: 345,
    height: 345,
    borderRadius: 200,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionInnerCircle: {
    width: 310,
    height: 310,
    borderRadius: 155,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  predictionLabel: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.black,
  },
  predictionDays: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  predictionStatus: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
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
  insightIconContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 8,
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
