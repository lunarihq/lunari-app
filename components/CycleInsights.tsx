import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CalendarIcon } from './icons/Calendar';
import { CycleIcon } from './icons/Cycle';
import { LeafIcon } from './icons/Leaf';
import { PeriodPredictionService } from '../services/periodPredictions';
import { useTheme } from '../styles/theme';

interface CycleInsightsProps {
  currentCycleDay: number | null;
  averageCycleLength: number;
}

export function CycleInsights({
  currentCycleDay,
  averageCycleLength,
}: CycleInsightsProps) {
  const { colors } = useTheme();

  const iconContainerStyle = {
    ...styles.insightIconContainer,
    backgroundColor: colors.surfaceVariant2,
  };

  const cardBorderStyle = {
    borderColor: colors.insightCardBorder,
    backgroundColor: colors.insightCardBackground,
  };

  return (
    <View style={[styles.insightsCard, { backgroundColor: colors.surface }]}>
      <View style={styles.insightsTitleContainer}>
        <Text style={[styles.insightsTitle, { color: colors.textPrimary }]}>
          Today's insights
        </Text>
        <Pressable
          onPress={() =>
            currentCycleDay &&
            router.push(
              `/(info)/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
            )
          }
          disabled={!currentCycleDay}
          style={[
            styles.chevronButton,
            !currentCycleDay && styles.chevronDisabled,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentCycleDay ? colors.textPrimary : colors.neutral200}
          />
        </Pressable>
      </View>
      {currentCycleDay ? (
        <View style={styles.insightsRow}>
          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() =>
              currentCycleDay &&
              router.push(
                `/(info)/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
              )
            }
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <CalendarIcon size={26} color={colors.icon} />
              </View>
              <Text
                style={[styles.insightLabel, { color: colors.textPrimary }]}
              >
                Cycle day
              </Text>
            </View>
            <View
              style={[
                styles.insightValueContainer,
                { backgroundColor: colors.surfaceVariant2 },
              ]}
            >
              <Text
                style={[styles.insightValue, { color: colors.textPrimary }]}
              >
                {currentCycleDay || '-'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() =>
              currentCycleDay &&
              router.push(
                `/(info)/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
              )
            }
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <CycleIcon size={26} color={colors.icon} />
              </View>
              <Text
                style={[styles.insightLabel, { color: colors.textPrimary }]}
              >
                Cycle phase
              </Text>
            </View>
            <View
              style={[
                styles.insightValueContainer,
                { backgroundColor: colors.surfaceVariant2 },
              ]}
            >
              <Text
                style={[styles.insightValue, { color: colors.textPrimary }]}
              >
                {currentCycleDay
                  ? PeriodPredictionService.getCyclePhase(
                      currentCycleDay,
                      averageCycleLength
                    )
                  : '-'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.insightCard, cardBorderStyle]}
            onPress={() =>
              currentCycleDay &&
              router.push(
                `/(info)/cycle-phase-details?cycleDay=${currentCycleDay}&averageCycleLength=${averageCycleLength}`
              )
            }
          >
            <View style={styles.insightTop}>
              <View style={iconContainerStyle}>
                <LeafIcon size={28} color={colors.icon} />
              </View>
              <Text
                style={[styles.insightLabel, { color: colors.textPrimary }]}
              >
                Chance to
              </Text>
              <Text
                style={[styles.insightLabel, { color: colors.textPrimary }]}
              >
                conceive
              </Text>
            </View>
            <View
              style={[
                styles.insightValueContainer,
                { backgroundColor: colors.surfaceVariant2 },
              ]}
            >
              <Text
                style={[styles.insightValue, { color: colors.textPrimary }]}
              >
                {currentCycleDay
                  ? PeriodPredictionService.getPregnancyChance(
                      currentCycleDay,
                      averageCycleLength
                    )
                  : '-'}
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Text style={[styles.insightsText, { color: colors.textPrimary }]}>
          Please log at least one period to view your cycle insights.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  insightsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  insightsText: {
    fontSize: 16,
    lineHeight: 18,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  insightCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
  },
  insightIconContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  insightLabel: {
    fontSize: 15,
    color: '#332F49',
    textAlign: 'center',
    lineHeight: 18,
  },
  insightValueContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  insightTop: {
    alignItems: 'center',
    width: '100%',
  },
  chevronButton: {
    padding: 4,
    borderRadius: 4,
  },
  chevronDisabled: {
    opacity: 0.5,
  },
});
