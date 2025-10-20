import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PeriodPredictionService } from '../../services/periodPredictions';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';
import { CycleIcon } from '../../components/icons/Cycle';
import { LeafIcon } from '../../components/icons/Leaf';
import { formatTodayShort, formatDateShort } from '../../utils/localeUtils';

const getFormattedDate = (date: Date): string => {
  return formatTodayShort(date);
};

const getCycleStartDate = (cycleDay: number): Date => {
  const today = new Date();
  const cycleStartDate = new Date(today);
  cycleStartDate.setDate(today.getDate() - (cycleDay - 1));
  return cycleStartDate;
};

const getFormattedCycleStart = (cycleDay: number): string => {
  if (cycleDay === 1) {
    return 'Your cycle started today';
  }

  const cycleStartDate = getCycleStartDate(cycleDay);
  const today = new Date();
  const isToday = cycleStartDate.toDateString() === today.toDateString();

  if (isToday) {
    return 'Your cycle started today';
  }

  return `This cycle started on ${formatDateShort(cycleStartDate)}`;
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
            { textAlign: 'center', marginBottom: 8 },
          ]}
        >
          Cycle day {cycleDay}
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
          {getFormattedCycleStart(cycleDay)}
        </Text>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.accentPinkLight },
              ]}
            >
              <CycleIcon size={36} color={colors.accentPink} />
            </View>
            <Text style={[typography.heading2, { marginLeft: 12 }]}>
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

          <Text style={[typography.body, { fontSize: 17, lineHeight: 23 }]}>
            {phaseDescription}
          </Text>
        </View>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
          <View style={styles.phaseHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.accentPinkLight },
              ]}
            >
              <LeafIcon size={40} color={colors.accentPink} />
            </View>
            <Text style={[typography.heading2, { marginLeft: 12 }]}>
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

          <Text style={[typography.body, { fontSize: 17, lineHeight: 23 }]}>
            {pregnancyDescription}
          </Text>
        </View>

        <View style={[styles.phaseCard, { backgroundColor: colors.surface }]}>
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
            <Text style={[typography.heading2, { marginLeft: 12 }]}>
              Possible symptoms
            </Text>
          </View>
          <Text style={[typography.body, { fontSize: 17, lineHeight: 23 }]}>
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
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
