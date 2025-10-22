import React from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createTypography } from '../../styles/theme';
import { commonStyles } from '@/styles/commonStyles';

export default function About() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('settings');
  const GITHUB_URL = 'https://github.com/lunari-app/lunari';
  const GPL_URL = 'https://www.gnu.org/licenses/gpl-3.0.en.html';

  return (
    <ScrollView
      style={[
        commonStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={[
        commonStyles.scrollContentContainer,
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
        {['predictions', 'tracking', 'statistics', 'insights', 'reminders', 'lock', 'theme'].map((feature) => (
          <Text
            key={feature}
            style={[
              typography.body,
              {marginBottom: 8, marginLeft: 8 },
            ]}
          >
            {t(`aboutScreen.features.${feature}`)}
          </Text>
        ))}
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
        {['local', 'noTransmission', 'noTracking', 'noAds', 'noAccount'].map((item) => (
          <Text
            key={item}
            style={[
              typography.body,
              {marginBottom: 8, marginLeft: 8 },
            ]}
          >
            {t(`aboutScreen.privacyFirst.${item}`)}
          </Text>
        ))}
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
        {['framework', 'database', 'language', 'platform'].map((item) => (
          <Text
            key={item}
            style={[
              typography.body,
              {marginBottom: 8, marginLeft: 8 },
            ]}
          >
            {t(`aboutScreen.technical.${item}`)}
          </Text>
        ))}
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
