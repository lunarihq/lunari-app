import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme } from '../styles/theme';

export default function About() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          About Lunari
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Version 1.0.0
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            What is Lunari?
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Lunari is a comprehensive period tracking app designed to help you
          understand and manage your menstrual cycle. Our app provides accurate
          predictions, cycle insights, and personalized tracking features to
          support your reproductive health journey.
        </Text>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Built with privacy and user control at its core, Lunari stores all
          your data locally on your device, ensuring your personal health
          information remains secure and private.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Features
          </Text>
        </View>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Accurate period and cycle predictions
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Symptom and mood tracking
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Personal notes and observations
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Cycle insights and statistics
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Customizable reminders
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • App lock for privacy protection
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Dark and light theme support
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="shield-checkmark-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Privacy First
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Your privacy is our top priority. Lunari is designed with a
          privacy-first approach:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • All data stored locally on your device
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • No data transmission to external servers
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • No third-party analytics or tracking
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Complete control over your data
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="code-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Technical Details
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Lunari is built using modern technologies to ensure reliability and
          performance:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Framework:</Text> React Native with Expo
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Database:</Text> SQLite with Drizzle ORM
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Language:</Text> TypeScript
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Platform:</Text> iOS and Android
        </Text>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Thank you for choosing Lunari for your period tracking needs. We're
          committed to providing you with a safe, private, and reliable
          experience.
        </Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          For support or feedback, please contact us through the app settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    marginLeft: 8,
  },
  bold: {
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
});
