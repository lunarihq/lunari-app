import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../services/periodPredictions';
import theme from './styles/theme';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
};

export default function CyclePhaseDetails() {
  const params = useLocalSearchParams();
  const cycleDay = parseInt(params.cycleDay as string) || 0;
  const currentDate = new Date();
  
  const cyclePhase = PeriodPredictionService.getCyclePhase(cycleDay);
  const phaseDescription = PeriodPredictionService.getPhaseDescription(cyclePhase);
  const pregnancyChance = PeriodPredictionService.getPregnancyChance(cycleDay);
  const pregnancyDescription = PeriodPredictionService.getPregnancyChanceDescription(pregnancyChance);
  const possibleSymptoms = PeriodPredictionService.getPossibleSymptoms(cyclePhase);

  return (
    <View style={theme.globalStyles.container}>
      <View style={styles.content}>
        <Text style={styles.dateText}>{getFormattedDate(currentDate)}</Text>
        
        <Text style={styles.cycleTitle}>Cycle day {cycleDay}</Text>
        
        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Ionicons name="sync-outline" size={24} color="#332F49" />
            <Text style={styles.cardTitle}>Cycle phase</Text>
          </View>
          
          <Text style={styles.phaseTitle}>{cyclePhase}</Text>
          
          <Text style={styles.phaseDescription}>{phaseDescription}</Text>
        </View>

        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Ionicons name="leaf-outline" size={24} color="#332F49" />
            <Text style={styles.cardTitle}>Chance to conceive</Text>
          </View>
          
          <Text style={styles.phaseTitle}>{pregnancyChance}</Text>
          
          <Text style={styles.phaseDescription}>{pregnancyDescription}</Text>
        </View>

        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Ionicons name="medical-outline" size={24} color="#332F49" />
            <Text style={styles.cardTitle}>Possible symptoms</Text>
          </View>
          
          <Text style={styles.phaseDescription}>{possibleSymptoms}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 30,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#332F49',
    marginBottom: 8,
    textAlign: 'center',
  },
  cycleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#332F49',
    textAlign: 'center',
    marginBottom: 32,
  },
  phaseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,

  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#332F49',
    marginLeft: 8,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#332F49',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 18,
    lineHeight: 24,
    color: '#332F49',
  },
}); 