import React from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function About() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('settings');
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
          {t('aboutScreen.title')}
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          {t('aboutScreen.version')}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            {t('aboutScreen.whatIs.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.whatIs.description')}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            {t('aboutScreen.features.title')}
          </Text>
        </View>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.predictions')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.tracking')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.statistics')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.insights')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.reminders')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.lock')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.features.theme')}
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
            {t('aboutScreen.privacyFirst.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.privacyFirst.description')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.privacyFirst.local')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.privacyFirst.noTransmission')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.privacyFirst.noTracking')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.privacyFirst.noAds')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.privacyFirst.noAccount')}
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
            {t('aboutScreen.openSource.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.openSource.description')}{' '}
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
          {t('aboutScreen.openSource.warranty')}
        </Text>
        <Text
          onPress={() => Linking.openURL(GITHUB_URL)}
          accessibilityRole="link"
          style={[
            typography.body,
            { color: colors.primary, textDecorationLine: 'underline' },
          ]}
        >
          {t('aboutScreen.openSource.viewSource')}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="code-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            {t('aboutScreen.technical.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.technical.description')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.technical.framework')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.technical.database')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.technical.language')}
        </Text>
        <Text
          style={[
            typography.body,
            {marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('aboutScreen.technical.platform')}
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
          {t('aboutScreen.footer')}
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
