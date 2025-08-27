import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './styles/theme';

export default function StatusInfo() {
  const { colors } = useTheme();

  const getTitle = () => {
    return 'Understanding Your Cycle';
  };

  const getDescription = () => {
    return 'Your menstrual cycle is the time from the first day of one period to the first day of the next period. This includes your period and the days between periods.';
  };

  const getNormalRange = () => {
    return '21-35 days';
  };

  const getNormalExplanation = () => {
    return 'A normal cycle length of 21-35 days indicates regular ovulation and good reproductive health. Most people have cycles that vary by a few days each month, which is completely normal.';
  };

  const getIrregularExplanation = () => {
    return 'Irregular cycles (shorter than 21 days or longer than 35 days) can be caused by stress, hormonal changes, medical conditions, or lifestyle factors. Tracking your cycles can help identify patterns.';
  };

  const getTips = () => {
    return '• Track your cycles for at least 3-6 months to establish a pattern\n• Factors like stress, travel, and illness can affect cycle length\n• Consult a healthcare provider if irregular cycles persist\n• Regular exercise and balanced nutrition support cycle health';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {getTitle()}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {getDescription()}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Normal Range
        </Text>
        <Text style={[styles.normalRange, { color: colors.textSecondary }]}>
          {getNormalRange()}
        </Text>
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          {getNormalExplanation()}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Irregular Cycles
        </Text>
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          {getIrregularExplanation()}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Tips for Tracking
        </Text>
        <Text style={[styles.tips, { color: colors.textSecondary }]}>
          {getTips()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  normalRange: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#10B981',
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
  },
  tips: {
    fontSize: 16,
    lineHeight: 24,
  },
});
