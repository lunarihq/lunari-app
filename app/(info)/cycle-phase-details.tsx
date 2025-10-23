import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { useTheme, createTypography } from '../../styles/theme';
import { createCommonStyles } from '../../styles/commonStyles';
import { CycleIcon } from '../../components/icons/general/Cycle';
import { LeafIcon } from '../../components/icons/general/Leaf';
import { formatTodayShort, formatDateShort } from '../../utils/localeUtils';
import { useTranslation } from 'react-i18next';

const getFormattedDate = (date: Date): string => {
  return formatTodayShort(date);
};

const getCycleStartDate = (cycleDay: number): Date => {
  const today = new Date();
  const cycleStartDate = new Date(today);
  cycleStartDate.setDate(today.getDate() - (cycleDay - 1));
  return cycleStartDate;
};

const getFormattedCycleStart = (cycleDay: number, t: any): string => {
  if (cycleDay === 1) {
    return t('info:cyclePhase.cycleStartedToday');
  }

  const cycleStartDate = getCycleStartDate(cycleDay);
  const today = new Date();
  const isToday = cycleStartDate.toDateString() === today.toDateString();

  if (isToday) {
    return t('info:cyclePhase.cycleStartedToday');
  }

  return `${t('info:cyclePhase.cycleStartedOn')} ${formatDateShort(cycleStartDate)}`;
};

export default function CyclePhaseDetails() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation('info');
  const params = useLocalSearchParams();
  const cycleDay = parseInt(params.cycleDay as string) || 0;
  const averageCycleLength =
    parseInt(params.averageCycleLength as string) || 28;
  const currentDate = new Date();

  const cyclePhaseKey = PeriodPredictionService.getCyclePhase(
    cycleDay,
    averageCycleLength
  );
  const pregnancyChanceKey = PeriodPredictionService.getPregnancyChance(
    cycleDay,
    averageCycleLength
  );

  return (
      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={commonStyles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            typography.body,
            { fontWeight: '500', marginBottom: 8, textAlign: 'center' },
          ]}
        >
          {getFormattedDate(currentDate)}
        </Text>

        <Text
          style={[
            typography.headingLg,
            { textAlign: 'center', marginBottom: 8 },
          ]}
        >
          {t('cyclePhase.cycleDay')} {cycleDay}
        </Text>

        <Text
          style={[
            typography.body,
            {
              textAlign: 'center',
              marginBottom: 24,
              color: colors.textSecondary,
              fontSize: 16,
            },
          ]}
        >
          {getFormattedCycleStart(cycleDay, t)}
        </Text>

        <View style={[commonStyles.sectionContainer]}>
          <View style={styles.phaseHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.accentPinkLight },
              ]}
            >
              <CycleIcon size={36} color={colors.accentPink} />
            </View>
            <Text style={[typography.headingMd, { marginLeft: 12 }]}>
              {t('cyclePhase.cyclePhaseTitle')}
            </Text>
          </View>

          <Text
            style={[
              typography.body,
              typography.bodyBold,
              { marginBottom: 8 },
            ]}
          >
            {t(`cyclePhase.phases.${cyclePhaseKey}`)}
          </Text>

          <Text style={[typography.body]}>
            {t(`cyclePhase.phaseDescriptions.${cyclePhaseKey}`)}
          </Text>
        </View>

        <View style={[commonStyles.sectionContainer]}>
          <View style={styles.phaseHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.accentPinkLight },
              ]}
            >
              <LeafIcon size={40} color={colors.accentPink} />
            </View>
            <Text style={[typography.headingMd, { marginLeft: 12 }]}>
              {t('cyclePhase.chanceToConceive')}
            </Text>
          </View>

          <Text
            style={[
              typography.body,
              typography.bodyBold,
              { marginBottom: 8 },
            ]}
          >
            {t(`cyclePhase.pregnancyChance.${pregnancyChanceKey}`)}
          </Text>

          <Text style={[typography.body]}>
            {t(`cyclePhase.pregnancyChanceDescriptions.${pregnancyChanceKey}`)}
          </Text>
        </View>

        {t(`cyclePhase.symptoms.${cyclePhaseKey}`) && (
          <View style={[commonStyles.sectionContainer]}>
            <View style={styles.phaseHeader}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.accentPinkLight },
                ]}
              >
                <Ionicons
                  name="thermometer-outline"
                  size={34}
                  color={colors.accentPink}
                />
              </View>
              <Text style={[typography.headingMd, { marginLeft: 12 }]}>
                {t('cyclePhase.possibleSymptoms')}
              </Text>
            </View>
            <Text style={[typography.body]}>
              {t(`cyclePhase.symptoms.${cyclePhaseKey}`)}
            </Text>
          </View>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
