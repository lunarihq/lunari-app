import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymptomsTracker } from './SymptomsTracker';
import { PeriodPredictionService } from '../../services/periodPredictions';

interface CycleDetailsProps {
  selectedDate: string;
  cycleDay: number | null;
}

export function CycleDetails({ selectedDate, cycleDay }: CycleDetailsProps) {
  const selectedDateFormatted = selectedDate ? 
    new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : '';

  const getConceptionChance = () => {
    if (!cycleDay) return '';
    const chance = PeriodPredictionService.getPregnancyChance(cycleDay);
    return `${chance.charAt(0).toUpperCase()}${chance.slice(1).toLowerCase()} chance to conceive`;
  };

  return (
    <>
      <View style={styles.cycleSummary}>
        <Text style={styles.cycleSummaryTitle}>
          {selectedDateFormatted}{cycleDay ? ` • Cycle day ${cycleDay}` : ''}
        </Text>
        {cycleDay && (
          <Text style={styles.conceptionChance}>{getConceptionChance()}</Text>
        )}
      </View>
      
      <SymptomsTracker 
        selectedDate={selectedDate} 
        titleStyle={{ fontSize: 20 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cycleSummary: {
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  cycleSummaryTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#332F49',
    marginBottom: 6,
  },
  conceptionChance: {
    fontSize: 16,
    color: '#878595',
  },
}); 

export default CycleDetails;