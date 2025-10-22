import React from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function About() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const GITHUB_URL = 'https://github.com/lunari-app/lunari';
  const GPL_URL = 'https://www.gnu.org/licenses/gpl-3.0.en.html';

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={[
        defaultTheme.globalStyles.scrollContentContainer,
        { paddingTop: 0 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[typography.heading1, { marginBottom: 8 }]}>
          About Lunari
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
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
        <Text style={[typography.body, { marginBottom: 12 }]}>
          Lunari is a privacy-first period tracking app designed to help you
          understand and manage your menstrual cycle.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Features
          </Text>
        </View>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Period and cycle predictions
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Symptom and mood tracking
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Cycle statistics & history
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Cycle phase insights
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • Period reminders
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • PIN/biometric app lock
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
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
        <Text style={[typography.body, { marginBottom: 12 }]}>
          Lunari is designed with a privacy-first approach:
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • All data is stored locally on your device
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No data transmission to external servers
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No third-party analytics or tracking
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No ads
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • No account required
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Open Source
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          Lunari is open-source and licensed under the{' '}
          <Text
            onPress={() => Linking.openURL(GPL_URL)}
            accessibilityRole="link"
            style={[
              typography.body,
              { color: colors.primary, textDecorationLine: 'underline' },
            ]}
          >
            GNU GPL v3
          </Text>
          .
        </Text>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          Lunari is distributed in the hope that it will be useful, but WITHOUT
          ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
          FITNESS FOR A PARTICULAR PURPOSE.
        </Text>
        <Text
          onPress={() => Linking.openURL(GITHUB_URL)}
          accessibilityRole="link"
          style={[
            typography.body,
            { color: colors.primary, textDecorationLine: 'underline' },
          ]}
        >
          View the source on GitHub
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="code-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            Technical Details
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          Lunari is built using modern technologies to ensure reliability and
          performance:
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Framework:</Text> React Native with Expo
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Database:</Text> SQLite with Drizzle ORM
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Language:</Text> TypeScript
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          • <Text style={styles.bold}>Platform:</Text> iOS and Android
        </Text>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
            },
          ]}
        >
          For support or feedback, please contact us at:
          <Text style={styles.bold}>lunari.appmail@gmail.app.</Text>
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
    marginBottom: 16,
  },
});
