import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from './styles/theme';

export default function LatePeriodInfo() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Why Your Period Might Be Late
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Common Reasons
          </Text>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Stress
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Physical or emotional stress can affect your hormones and delay your period. This includes work stress, relationship issues, or major life changes.
            </Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Weight Changes
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Significant weight gain or loss can disrupt your hormonal balance and affect your menstrual cycle.
            </Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Exercise Changes
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Sudden increases in exercise intensity or training for events can temporarily disrupt your cycle.
            </Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Hormonal Changes
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Changes in birth control, thyroid issues, or other hormonal imbalances can affect your cycle timing.
            </Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Sleep Pattern Changes
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Shift work, travel, or significant changes to your sleep schedule can impact your menstrual cycle.
            </Text>
          </View>
          
          <View style={styles.reasonItem}>
            <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
              Illness or Medication
            </Text>
            <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
              Being sick, certain medications, or recent medical procedures can temporarily delay your period.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Natural Cycle Variation
          </Text>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            It's normal for menstrual cycles to vary slightly from month to month. A cycle that's 21-35 days long is considered normal, and variation of a few days is completely typical.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            When to See a Healthcare Provider
          </Text>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            Consider consulting a healthcare provider if:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              Your period is more than 7 days late and pregnancy is ruled out
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              You've missed multiple periods in a row
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              You have other concerning symptoms
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              Your cycle suddenly becomes very irregular
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for personalized guidance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  reasonItem: {
    marginBottom: 16,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reasonDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  note: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});
