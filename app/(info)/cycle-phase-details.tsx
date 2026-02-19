import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';
import { CycleIcon } from '../../components/icons/general/Cycle';
import { LeafIcon } from '../../components/icons/general/Leaf';
import { SymptomsIcon } from '../../components/icons/general/Symptoms';
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
  const { typography, commonStyles, scrollContentContainerWithSafeArea } = useAppStyles();
  const { t } = useTranslation('info');
  const params = useLocalSearchParams();
  const cycleDay = parseInt(params.cycleDay as string) || 0;
  const averageCycleLength =
    parseInt(params.averageCycleLength as string) || 28;
  const averagePeriodLength =
    parseInt(params.averagePeriodLength as string) || 5;
  const currentDate = new Date();

  const cyclePhaseKey = PeriodPredictionService.getCyclePhase(cycleDay, averageCycleLength, averagePeriodLength);
  const pregnancyChanceKey = PeriodPredictionService.getPregnancyChance(
    cycleDay,
    averageCycleLength
  );

  return (
      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={[scrollContentContainerWithSafeArea, { paddingTop: 24 }]}
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
              <CycleIcon size={32} />
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
              <LeafIcon size={34}/>
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

              <SymptomsIcon size={34}/>
              <Text style={[typography.headingMd, { marginLeft: 12 }]}>
                {t('cyclePhase.commonSymptoms')}
              </Text>
            </View>
            {(() => {
              const symptomsData = t(`cyclePhase.symptoms.${cyclePhaseKey}`, { returnObjects: true }) as 
                string | { intro?: string; items?: string[]; note?: string };
              
              if (typeof symptomsData === 'string') {
                return <Text style={[typography.body]}>{symptomsData}</Text>;
              }
              
              return (
                <>
                  {symptomsData.intro && (
                    <Text style={[typography.body]}>{symptomsData.intro}</Text>
                  )}
                  
                  {symptomsData.items && symptomsData.items.map((symptom: string, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 }}>
                      <Text style={[typography.body, { marginRight: 8 }]}>{'\u2022'}</Text>
                      <Text style={[typography.body, { flex: 1 }]}>{symptom}</Text>
                    </View>
                  ))}
                  
                  {symptomsData.note && (
                    <Text style={[typography.body, { marginTop: 16 }]}>{symptomsData.note}</Text>
                  )}
                </>
              );
            })()}
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
});
