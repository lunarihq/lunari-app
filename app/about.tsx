import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme, createTypography } from '../styles/theme';

export default function About() {
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
          About Lunari
        </Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>
          Version 1.0.0
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            What is Lunari?
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Lunari is a comprehensive period tracking app designed to help you
          understand and manage your menstrual cycle. Our app provides accurate
          predictions, cycle insights, and personalized tracking features to
          support your reproductive health journey.
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Built with privacy and user control at its core, Lunari stores all
          your data locally on your device, ensuring your personal health
          information remains secure and private.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Features
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Accurate period and cycle predictions
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Symptom and mood tracking
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Personal notes and observations
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Cycle insights and statistics
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Customizable reminders
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • App lock for privacy protection
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
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
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Privacy First
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Your privacy is our top priority. Lunari is designed with a
          privacy-first approach:
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • All data stored locally on your device
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • No data transmission to external servers
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • No third-party analytics or tracking
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • Complete control over your data
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="code-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Technical Details
          </Text>
        </View>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 12 }]}>
          Lunari is built using modern technologies to ensure reliability and
          performance:
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • <Text style={styles.bold}>Framework:</Text> React Native with Expo
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • <Text style={styles.bold}>Database:</Text> SQLite with Drizzle ORM
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • <Text style={styles.bold}>Language:</Text> TypeScript
        </Text>
        <Text style={[typography.body, { lineHeight: 24, marginBottom: 8, marginLeft: 8 }]}>
          • <Text style={styles.bold}>Platform:</Text> iOS and Android
        </Text>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text style={[typography.body, { color: colors.textMuted, lineHeight: 24, textAlign: 'center', marginBottom: 8 }]}>
          Thank you for choosing Lunari for your period tracking needs. We're
          committed to providing you with a safe, private, and reliable
          experience.
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, lineHeight: 24, textAlign: 'center', marginBottom: 8 }]}>
          For support or feedback, please contact us through the app settings.
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
