import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme } from './styles/theme';

export default function PrivacyPolicy() {
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
          Privacy Policy
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Introduction
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Lunari is a period tracking app designed to help you understand your
          menstrual cycle. We are committed to protecting your privacy and
          ensuring your personal health data remains secure and private.
        </Text>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          This privacy policy explains how we collect, use, and protect your
          information when you use our app. By using Lunari, you agree to the
          collection and use of information in accordance with this policy.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Data Use
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          We collect and store the following information locally on your device:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Period start and end dates
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Cycle length and period duration
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Symptoms and mood tracking data
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • Notes and personal observations
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • App preferences and settings
        </Text>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          This data is used solely to provide you with accurate period
          predictions, cycle insights, and personalized tracking features. We do
          not share, sell, or transmit your personal health data to any third
          parties.
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
            Permissions
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          Lunari may request the following permissions:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Notifications:</Text> To send you period
          reminders and cycle predictions
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Biometric Authentication:</Text> To secure
          your app with fingerprint or face recognition (optional)
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • <Text style={styles.bold}>Device Storage:</Text> To store your
          tracking data locally on your device
        </Text>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          All permissions are optional and can be revoked at any time through
          your device settings. The app will continue to function with limited
          features if permissions are denied.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Transparency
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          We believe in complete transparency about how your data is handled:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • All your data is stored locally on your device
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • No data is transmitted to external servers
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • You can export or delete all your data at any time
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • We do not use analytics or tracking services
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.textPrimary }]}>
          • No third-party advertising or data collection
        </Text>
        <Text style={[styles.sectionContent, { color: colors.textPrimary }]}>
          You have full control over your data. You can delete all tracking data
          through the settings menu, and the app will continue to work normally
          without any stored information.
        </Text>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          If you have any questions about this privacy policy or how we handle
          your data, please contact us through the app settings.
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
  },
});
