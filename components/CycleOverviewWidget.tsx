import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinkButton } from './LinkButton';
import DashedCircle from './DashedCircle';
import { useTheme } from '../app/styles/theme';
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
            style={[styles.primaryButton, { marginVertical: 16 }]}
          >
            <Text style={styles.buttonText}>
              {Object.keys(selectedDates).length > 0
                ? 'Edit period dates'
                : 'Log period'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
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
  emptyStateText: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currentDay: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
