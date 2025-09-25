import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../../services/periodPredictions';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

const getFormattedDate = (date: Date): string => {
  return `Today, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
};

export default function CyclePhaseDetails() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
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
        { backgroundColor: colors.background, paddingTop: 16 },
      ]}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
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
            typography.heading1,
            { textAlign: 'center', marginBottom: 32 },
          ]}
        >
          Cycle day {cycleDay}
        </Text>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <Ionicons
              name="sync-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={[typography.heading2, { marginLeft: 8 }]}>
              Cycle phase
            </Text>
          </View>

          <Text
            style={[
              typography.body,
              { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
            ]}
          >
            {cyclePhase}
          </Text>

          <Text style={[typography.body, { fontSize: 18, lineHeight: 24 }]}>
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
            <Text style={[typography.heading2, { marginLeft: 8 }]}>
              Chance to conceive
            </Text>
          </View>

          <Text
            style={[
              typography.body,
              { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
            ]}
          >
            {pregnancyChance}
          </Text>

          <Text style={[typography.body, { fontSize: 18, lineHeight: 24 }]}>
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
            <Text style={[typography.heading2, { marginLeft: 8 }]}>
              Possible symptoms
            </Text>
          </View>
          <Text style={[typography.body, { fontSize: 18, lineHeight: 24 }]}>
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
});
