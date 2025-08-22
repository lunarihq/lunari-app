import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './styles/theme';

export default function PeriodLength() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Understanding Your Period
        </Text>
        
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Your period is the number of days you experience menstrual bleeding each cycle. This is when your body sheds the uterine lining that built up during your cycle.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Normal Period Length
        </Text>
        <Text style={[styles.normalRange, { color: colors.textSecondary }]}>
          2-7 days
        </Text>
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          A normal period length of 2-7 days is typical for most people. The flow usually starts light, becomes heavier for a few days, then tapers off. Period length can vary from cycle to cycle, which is completely normal.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Irregular Periods
        </Text>
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          Irregular periods (shorter than 2 days or longer than 7 days) may indicate hormonal imbalances, stress, or underlying health conditions. Very heavy bleeding or very light periods may need medical attention.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Period Flow Patterns
        </Text>
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          • Light flow: Minimal bleeding, may only need panty liners{'\n'}
          • Moderate flow: Regular tampon/pad changes every 4-6 hours{'\n'}
          • Heavy flow: Frequent changes every 2-3 hours{'\n'}
          • Very heavy: Soaking through protection in less than 2 hours
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Tips for Period Health
        </Text>
        <Text style={[styles.tips, { color: colors.textSecondary }]}>
          • Track your period length and flow intensity{'\n'}
          • Stay hydrated and maintain good nutrition{'\n'}
          • Use appropriate period products for your flow{'\n'}
          • Consider tracking symptoms like cramps or mood changes{'\n'}
          • Consult a healthcare provider if periods are consistently irregular{'\n'}
          • Rest when needed and listen to your body
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
