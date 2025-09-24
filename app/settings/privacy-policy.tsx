import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function PrivacyPolicy() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

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
        <Text style={[typography.heading1, { marginBottom: 8 }]}>
          Privacy Policy
        </Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>
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
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Introduction
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Lunari is a period tracking app designed to help you understand your
          menstrual cycle. We are committed to protecting your privacy and
          ensuring your personal health data remains secure and private.
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          This privacy policy explains how we collect, use, and protect your
          information when you use our app. By using Lunari, you agree to the
          collection and use of information in accordance with this policy.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Data Use
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          We collect and store the following information locally on your device:
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Period start and end dates
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Cycle length and period duration
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Symptoms and mood tracking data
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Notes and personal observations
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • App preferences and settings
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
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
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Permissions
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Lunari may request the following permissions:
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Notifications:</Text> To send you period
          reminders and cycle predictions
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Biometric Authentication:</Text> To secure
          your app with fingerprint or face recognition (optional)
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Device Storage:</Text> To store your
          tracking data locally on your device
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          All permissions are optional and can be revoked at any time through
          your device settings. The app will continue to function with limited
          features if permissions are denied.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Transparency
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          We believe in complete transparency about how your data is handled:
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • All your data is stored locally on your device
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No data is transmitted to external servers
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • You can export or delete all your data at any time
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • We do not use analytics or tracking services
        </Text>
        <Text
          style={[
            typography.body,
            { lineHeight: 24, marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No third-party advertising or data collection
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          You have full control over your data. You can delete all tracking data
          through the settings menu, and the app will continue to work normally
          without any stored information.
        </Text>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, lineHeight: 24, textAlign: 'center' },
          ]}
        >
          If you have any questions about this privacy policy or how we handle
          your data, please contact us through the app settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
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
  bold: {
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
});
