import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinkButton } from './LinkButton';
import { Button } from './Button';
import DashedCircle from './DashedCircle';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { formatTodayShort } from '../utils/localeUtils';

interface CycleOverviewWidgetProps {
  currentDate: Date;
  isPeriodDay: boolean;
  periodDayNumber: number;
  prediction: any;
  selectedDates: { [date: string]: any };
  currentCycleDay: number | null;
  averageCycleLength: number;
}

const getFormattedDate = (date: Date): string => formatTodayShort(date);

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
  const { typography } = useAppStyles();
  const { t } = useTranslation('home');

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
                  typography.bodyBold,
                  { marginBottom: 20 },
                  { color: circleTextColor },
                ]}
              >
                {getFormattedDate(currentDate)}
              </Text>
              <Text
                style={[
                  typography.labelLg,
                  { color: circleTextColor },
                ]}
              >
                {t('period')}
              </Text>
              <Text
                style={[
                  typography.displayLg,
                  {
                    marginBottom: 8,
                    paddingHorizontal: 8,
                  },
                  { color: circleTextColor },
                ]}
              >
                {t('periodDay', { number: periodDayNumber })}
              </Text>
            </>
          ) : prediction ? (
            <>
              <Text
                style={[
                  typography.bodyBold,
                  { marginBottom: 20 },
                  { color: circleTextColor },
                ]}
              >
                {getFormattedDate(currentDate)}
              </Text>
              {prediction.days > 0 ? (
                <>
                  <Text
                    style={[
                      typography.labelLg,
                      { color: circleTextColor },
                    ]}
                  >
                    {t('nextPeriodIn')}
                  </Text>
                  {/* Next period in X day display */}
                  <Text
                    style={[
                      typography.displayLg,
                      {
                        marginBottom: 8,
                        paddingHorizontal: 8,
                      },
                      { color: circleTextColor },
                    ]}
                  >
                    {t('daysCount', { count: prediction.days })}
                  </Text>
                </>
                /* Period expected today display */
              ) : prediction.days === 0 ? (
                <Text
                  style={[
                    typography.displaySm,
                    {
                      textAlign: 'center',
                      paddingHorizontal: 16,
                      marginBottom: 16,
                    },
                    { color: circleTextColor },
                  ]}
                >
                  {t('expectedToday')}
                </Text>
              ) : (
                <>
                {/* Late for X days display */}
                  <Text
                    style={[
                      typography.labelLg,
                      { color: circleTextColor },
                    ]}
                  >
                    {t('lateFor')}
                  </Text>
                  <Text
                    style={[
                      typography.displayLg,
                      {
                        marginBottom: 8,
                        paddingHorizontal: 8,
                      },
                      { color: circleTextColor },
                    ]}
                  >
                    {t('daysCount', { count: Math.abs(prediction.days) })}
                  </Text>
                  <LinkButton
                    title={t('learnAboutLatePeriods')}
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
                {t('noDataPrompt')}
              </Text>
            </>
          )}
          <Button
            title={
              prediction?.days < 0 || !prediction
                ? t('logPeriod')
                : t('logOrEdit')
            }
            onPress={() => router.push('/edit-period')}
            style={{ marginVertical: 16 }}
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
