import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinkButton } from './LinkButton';
import { Button } from './Button';
import DashedCircle from './DashedCircle';
import { useTheme, createTypography } from '../styles/theme';

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
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);

  const isPredictedPeriodDay = prediction?.days === 0;
  const isSpecialDay = isPeriodDay || isPredictedPeriodDay;
  const circleTextColor =
    isSpecialDay && isDark ? colors.black : colors.textPrimary;

  return (
    <View style={styles.predictionCard}>
      <View style={styles.predictionOuterCircle}>
        <DashedCircle
          size={350}
          strokeWidth={3}
          dashLength={3}
          dashCount={120}
          strokeColor={
            isSpecialDay ? colors.predictionCirclePeriodOuter : undefined
          }
        />
        <View
          style={[
            styles.predictionInnerCircle,
            {
              backgroundColor: isSpecialDay
                ? colors.predictionCirclePeriodBackground
                : colors.predictionCircleBackground,
            },
          ]}
        >
          {isPeriodDay ? (
            <>
              <Text
                style={[
                  typography.body,
                  { fontWeight: '500', marginBottom: 20 },
                  { color: circleTextColor },
                ]}
              >
                {getFormattedDate(currentDate)}
              </Text>
              <Text
                style={[
                  typography.heading2,
                  { fontSize: 22, fontWeight: '500' },
                  { color: circleTextColor },
                ]}
              >
                Period
              </Text>
              <Text
                style={[
                  typography.heading1,
                  {
                    fontSize: 48,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    paddingHorizontal: 8,
                  },
                  { color: circleTextColor },
                ]}
              >
                Day {periodDayNumber}
              </Text>
            </>
          ) : prediction ? (
            <>
              <Text
                style={[
                  typography.body,
                  { fontWeight: '500', marginBottom: 20 },
                  { color: circleTextColor },
                ]}
              >
                {getFormattedDate(currentDate)}
              </Text>
              {prediction.days > 0 ? (
                <>
                  <Text
                    style={[
                      typography.heading2,
                      { fontSize: 22, fontWeight: '500' },
                      { color: circleTextColor },
                    ]}
                  >
                    Next period in
                  </Text>
                  <Text
                    style={[
                      typography.heading1,
                      {
                        fontSize: 48,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        paddingHorizontal: 8,
                      },
                      { color: circleTextColor },
                    ]}
                  >
                    {prediction.days} {prediction.days === 1 ? 'day' : 'days'}
                  </Text>
                </>
              ) : prediction.days === 0 ? (
                <Text
                  style={[
                    typography.heading2,
                    {
                      fontSize: 28,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginBottom: 32,
                      paddingHorizontal: 16,
                    },
                    { color: circleTextColor },
                  ]}
                >
                  Your period is expected today
                </Text>
              ) : (
                <>
                  <Text
                    style={[
                      typography.heading2,
                      { fontSize: 22, fontWeight: '500' },
                      { color: circleTextColor },
                    ]}
                  >
                    Late for
                  </Text>
                  <Text
                    style={[
                      typography.heading1,
                      {
                        fontSize: 48,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        paddingHorizontal: 8,
                      },
                      { color: circleTextColor },
                    ]}
                  >
                    {Math.abs(prediction.days)}{' '}
                    {Math.abs(prediction.days) === 1 ? 'day' : 'days'}
                  </Text>
                  <LinkButton
                    title="Learn about late periods"
                    onPress={() => router.push('/(info)/late-period-info')}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Text
                style={[
                  typography.body,
                  { fontWeight: '500', marginBottom: 20 },
                  { color: circleTextColor },
                ]}
              >
                {getFormattedDate(currentDate)}
              </Text>
              <Text
                style={[
                  typography.body,
                  {
                    fontSize: 20,
                    fontWeight: '500',
                    lineHeight: 28,
                    textAlign: 'center',
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  },
                  { color: circleTextColor },
                ]}
              >
                Log the first day of your last period for next prediction.
              </Text>
            </>
          )}
          <Button
            title={
              Object.keys(selectedDates).length > 0
                ? 'Log or edit period dates'
                : 'Log period'
            }
            onPress={() => router.push('/edit-period')}
            style={
              isSpecialDay
                ? { marginVertical: 16, backgroundColor: colors.accentPink }
                : { marginVertical: 16 }
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  predictionCard: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 24,
  },
  predictionOuterCircle: {
    width: 345,
    height: 345,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionInnerCircle: {
    width: 310,
    height: 310,
    borderRadius: 155,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor removed - now handled dynamically via colors.predictionCircleBackground
  },
});
