import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SymptomsTracker } from './SymptomsTracker';
import { PeriodPredictionService } from '../services/periodPredictions';
import { formatDateString } from '../app/types/calendarTypes';
import { useTheme } from '../app/styles/theme';

interface CycleDetailsProps {
  selectedDate: string;
  cycleDay: number | null;
  averageCycleLength?: number;
  onClose?: () => void;
}

export function CycleDetails({ selectedDate, cycleDay, averageCycleLength = 28, onClose }: CycleDetailsProps) {
  const { colors } = useTheme();
  const selectedDateFormatted = selectedDate ? 
    new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : '';

  const getConceptionChance = () => {
    if (!cycleDay) return '';
    const chance = PeriodPredictionService.getPregnancyChance(cycleDay, averageCycleLength);
    return `${chance.charAt(0).toUpperCase()}${chance.slice(1).toLowerCase()} chance to conceive`;
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
            <Text style={[styles.cycleSummaryTitle, { color: colors.textPrimary }]}>
              {selectedDateFormatted}{cycleDay ? ` • Cycle day ${cycleDay}` : ''}
            </Text>
            {cycleDay && (
              <Text style={[styles.conceptionChance, { color: colors.textMuted }]}>{getConceptionChance()}</Text>
            )}
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {isDateInPastOrToday() && (
        <SymptomsTracker 
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
  cycleSummaryTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  conceptionChance: {
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
    marginTop: -4,
  },
}); 

export default CycleDetails;