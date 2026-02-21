import React, { useMemo } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CalendarIcon } from './icons/general/Calendar';
import { CycleIcon } from './icons/general/Cycle';
import { FertilityIcon } from './icons/general/fertility';
import { PeriodPredictionService } from '../services/periodPredictions';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';

interface CycleInsightsProps {
  currentCycleDay: number | null;
  averageCycleLength: number;
  averagePeriodLength: number;
}

export function CycleInsights({
  currentCycleDay,
  averageCycleLength,
  averagePeriodLength,
}: CycleInsightsProps) {
  const { colors } = useTheme();
  const { typography, commonStyles } = useAppStyles();
  const { t } = useTranslation('home');

  const iconContainerStyle = useMemo(
    () => ({
      ...styles.insightIconContainer,
      backgroundColor: colors.surfaceVariant2,
    }),
    [colors.surfaceVariant2]
  );

  const cardBorderStyle = useMemo(
    () => ({
      borderColor: colors.insightCardBorder,
      backgroundColor: colors.insightCardBackground,
    }),
    [colors.insightCardBorder, colors.insightCardBackground]
  );

  const insightValueStyle = useMemo(
    () => [styles.insightValueContainer, { backgroundColor: colors.surfaceVariant2 }],
    [colors.surfaceVariant2]
  );

  const insightLabelStyle = useMemo(
    () => [styles.insightLabel, { color: colors.textPrimary }],
    [colors.textPrimary]
  );

  const insightTextStyle = useMemo(
    () => [styles.insightValue, { color: colors.textPrimary }],
    [colors.textPrimary]
  );

  const baseParams = `cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}&averagePeriodLength=${averagePeriodLength}`;
  const detailsUrl = (scrollTo?: string) =>
    currentCycleDay
      ? `/(info)/cycle-phase-details?${baseParams}${scrollTo ? `&scrollTo=${scrollTo}` : ''}`
      : null;

  return (
    <View style={[commonStyles.sectionContainer]}>
      <View style={[commonStyles.sectionTitleContainer, !currentCycleDay && { marginBottom: 10 }]}>
        <Text style={[typography.headingMd, {flex: 1}]}>
          {t('cycleInsights.todaysInsights')}
        </Text>
        <Pressable
          onPress={() => detailsUrl() && router.push(detailsUrl() as Href)}
          disabled={!currentCycleDay}
          style={[
            styles.chevronButton,
            !currentCycleDay && styles.chevronDisabled,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentCycleDay ? colors.textPrimary : colors.neutral200}
          />
        </Pressable>
      </View>
      {currentCycleDay ? (
        <View style={styles.insightsRow}>
          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() => detailsUrl() && router.push(detailsUrl() as Href)}
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <CalendarIcon size={28}/>
              </View>
              <Text style={insightLabelStyle}>
                {t('cycleInsights.cycleDay')}
              </Text>
            </View>
            <View style={insightValueStyle}>
              <Text style={insightTextStyle}>
                {currentCycleDay || '-'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() => detailsUrl('cyclePhase') && router.push(detailsUrl('cyclePhase') as Href)}
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <CycleIcon size={28} />
              </View>
              <Text style={insightLabelStyle}>
                {t('cycleInsights.cyclePhase')}
              </Text>
            </View>
            <View style={insightValueStyle}>
              <Text style={insightTextStyle}>
                {currentCycleDay
                  ? t(`cycleInsights.${PeriodPredictionService.getCyclePhase(
                      currentCycleDay,
                      averageCycleLength,
                      averagePeriodLength
                    )}`)
                  : '-'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() => detailsUrl('chanceToConceive') && router.push(detailsUrl('chanceToConceive') as Href)}
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <FertilityIcon size={28} />
              </View>
              <Text style={insightLabelStyle}>
                {t('cycleInsights.chanceToConceive')}
              </Text>
            </View>
            <View style={insightValueStyle}>
              <Text style={insightTextStyle}>
                {currentCycleDay
                  ? t(`cycleInsights.${PeriodPredictionService.getPregnancyChance(
                      currentCycleDay,
                      averageCycleLength
                    )}`)
                  : '-'}
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Text style={[typography.body, { color: colors.textPrimary }]}>
          {t('cycleInsights.emptyState')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  insightsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
  },
  insightIconContainer: {
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
    paddingHorizontal: 8,
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
  insightTop: {
    alignItems: 'center',
    width: '100%',
  },
  chevronButton: {
    padding: 4,
    borderRadius: 4,
  },
  chevronDisabled: {
    opacity: 0.38,
  },
});
