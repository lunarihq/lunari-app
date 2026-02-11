import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';

export interface PhaseHealthLogs {
  [phase: string]: {
    dayRange: string;
    items: {
      [itemId: string]: {
        type: string;
        count: number;
      };
    };
  };
}

interface HealthLogsSummaryProps {
  phaseLogs: PhaseHealthLogs;
}

export const HealthLogsSummary = ({ phaseLogs }: HealthLogsSummaryProps) => {
  const { colors } = useTheme();
  const { typography } = useAppStyles();
  const { t } = useTranslation(['stats', 'health']);

  const phaseOrder = ['menstrual', 'follicular', 'ovulatory', 'luteal', 'extended'];
  const sortedPhases = phaseOrder.filter(phase => phaseLogs[phase]);

  if (sortedPhases.length === 0) return null;

  const getPhaseLabel = (phase: string) => {
    const labels: { [key: string]: string } = {
      menstrual: t('stats:cycleDetails.menstrualPhase'),
      follicular: t('stats:cycleDetails.follicularPhase'),
      ovulatory: t('stats:cycleDetails.ovulatoryPhase'),
      luteal: t('stats:cycleDetails.lutealPhase'),
      extended: t('stats:cycleDetails.extendedPhase'),
    };
    return labels[phase] || phase;
  };

  const getItemLabel = (type: string, itemId: string) => {
    if (type === 'symptom') return t(`health:symptoms.${itemId}`);
    if (type === 'mood') return t(`health:moods.${itemId}`);
    if (type === 'flow') return t(`health:flows.${itemId}`);
    if (type === 'discharge') return t(`health:discharge.${itemId}`);
    return itemId;
  };

  return (
    <View style={[styles.healthLogsCard, { backgroundColor: colors.surface }]}>
      <Text style={[typography.body, { color: colors.textSecondary, fontWeight: '500', marginBottom: 12 }]}>
        {t('stats:cycleDetails.healthLogsSummary')}
      </Text>

      {sortedPhases.map((phase, idx) => {
        const phaseData = phaseLogs[phase];
        const items = Object.entries(phaseData.items);

        return (
          <View key={phase} style={[idx > 0 && { marginTop: 16 }]}>
            <Text style={[typography.body, { fontWeight: '600', marginBottom: 6 }]}>
              {getPhaseLabel(phase)} {phaseData.dayRange && `(${phaseData.dayRange})`}
            </Text>
            <View style={styles.itemsContainer}>
              {items.map(([itemId, data], itemIdx) => (
                <Text key={itemId} style={[typography.body, { color: colors.textSecondary }]}>
                  {getItemLabel(data.type, itemId)} • {data.count}x
                  {itemIdx < items.length - 1 && '    '}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  healthLogsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
