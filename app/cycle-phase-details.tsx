import React from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../services/periodPredictions';
import theme from './styles/theme';
import Colors from './styles/colors';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
};

export default function CyclePhaseDetails() {
  const params = useLocalSearchParams();
  const cycleDay = parseInt(params.cycleDay as string) || 0;
  const averageCycleLength = parseInt(params.averageCycleLength as string) || 28;
  const currentDate = new Date();
  
  const cyclePhase = PeriodPredictionService.getCyclePhase(cycleDay, averageCycleLength);
  const phaseDescription = PeriodPredictionService.getPhaseDescription(cyclePhase);
  const pregnancyChance = PeriodPredictionService.getPregnancyChance(cycleDay, averageCycleLength);
  const pregnancyDescription = PeriodPredictionService.getPregnancyChanceDescription(pregnancyChance);
  const possibleSymptoms = PeriodPredictionService.getPossibleSymptoms(cyclePhase);

  return (
    <View style={theme.globalStyles.container}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            <Ionicons name="medical-outline" size={24} color={Colors.textPrimary} />
            <Text style={styles.cardTitle}>Possible symptoms</Text>
          </View>
          <Text style={styles.phaseDescription}>{possibleSymptoms}</Text>
        </View>

      </ScrollView>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 40,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  cycleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
  },
  phaseCard: {
    backgroundColor: Colors.white,
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
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
}); 