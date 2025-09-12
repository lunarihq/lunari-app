import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../services/periodPredictions';
import defaultTheme, { useTheme } from '../styles/theme';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
};

export default function CyclePhaseDetails() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const cycleDay = parseInt(params.cycleDay as string) || 0;
  const averageCycleLength =
    parseInt(params.averageCycleLength as string) || 28;
  const currentDate = new Date();

  const cyclePhase = PeriodPredictionService.getCyclePhase(
    cycleDay,
    averageCycleLength
  );
  const phaseDescription =
    PeriodPredictionService.getPhaseDescription(cyclePhase);
  const pregnancyChance = PeriodPredictionService.getPregnancyChance(
    cycleDay,
    averageCycleLength
  );
  const pregnancyDescription =
    PeriodPredictionService.getPregnancyChanceDescription(pregnancyChance);
  const possibleSymptoms =
    PeriodPredictionService.getPossibleSymptoms(cyclePhase);

  return (
    <View
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.dateText, { color: colors.textPrimary }]}>
          {getFormattedDate(currentDate)}
        </Text>

        <Text style={[styles.cycleTitle, { color: colors.textPrimary }]}>
          Cycle day {cycleDay}
        </Text>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <Ionicons
              name="sync-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Cycle phase
            </Text>
          </View>

          <Text style={[styles.phaseTitle, { color: colors.textPrimary }]}>
            {cyclePhase}
          </Text>

          <Text
            style={[styles.phaseDescription, { color: colors.textPrimary }]}
          >
            {phaseDescription}
          </Text>
        </View>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <Ionicons
              name="leaf-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Chance to conceive
            </Text>
          </View>

          <Text style={[styles.phaseTitle, { color: colors.textPrimary }]}>
            {pregnancyChance}
          </Text>

          <Text
            style={[styles.phaseDescription, { color: colors.textPrimary }]}
          >
            {pregnancyDescription}
          </Text>
        </View>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <Ionicons
              name="medical-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Possible symptoms
            </Text>
          </View>
          <Text
            style={[styles.phaseDescription, { color: colors.textPrimary }]}
          >
            {possibleSymptoms}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  dateText: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  cycleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  phaseCard: {
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
    marginLeft: 8,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 18,
    lineHeight: 24,
  },
});
