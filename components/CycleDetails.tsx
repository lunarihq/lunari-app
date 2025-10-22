import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { QuickHealthSelector } from './QuickHealthSelector';
import { PeriodPredictionService } from '../services/periodPredictions';
import { formatDateString } from '../types/calendarTypes';
import { useTheme, createTypography } from '../styles/theme';
import { formatDateLong } from '../utils/localeUtils';

interface CycleDetailsProps {
  selectedDate: string;
  cycleDay: number | null;
  averageCycleLength?: number;
  onClose?: () => void;
}

export function CycleDetails({
  selectedDate,
  cycleDay,
  averageCycleLength = 28,
  onClose,
}: CycleDetailsProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('common');
  const selectedDateFormatted = selectedDate
    ? formatDateLong(selectedDate)
    : '';

  const getConceptionChance = () => {
    if (!cycleDay) return '';
    const chance = PeriodPredictionService.getPregnancyChance(
      cycleDay,
      averageCycleLength
    ).toLowerCase();
    
    // Map the chance to translation key
    return t(`cycleDetails.conceptionChance.${chance}`);
  };

  // Check if selected date is today or in the past
  const isDateInPastOrToday = () => {
    const today = formatDateString(new Date());
    return selectedDate <= today;
  };

  return (
    <>
      <View style={styles.cycleSummary}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                typography.heading2,
                { fontSize: 23, fontWeight: 'bold', marginBottom: 6 },
              ]}
            >
              {selectedDateFormatted}
              {cycleDay ? ` • ${t('cycleDetails.cycleDay', { number: cycleDay })}` : ''}
            </Text>
            {cycleDay && (
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                {getConceptionChance()}
              </Text>
            )}
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isDateInPastOrToday() && (
        <QuickHealthSelector
          selectedDate={selectedDate}
          titleStyle={{ fontSize: 20 }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cycleSummary: {
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginTop: -5,
  },
});

export default CycleDetails;
