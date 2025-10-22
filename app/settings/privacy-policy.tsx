import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';
import * as Localization from 'expo-localization';

export default function PrivacyPolicy() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('settings');

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
          {t('privacyPolicyScreen.title')}
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          {t('privacyPolicyScreen.lastUpdated')} {new Date().toLocaleDateString(Localization.getLocales()[0].languageTag)}
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
            {t('privacyPolicyScreen.introduction.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.introduction.description')}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            {t('privacyPolicyScreen.dataUse.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.dataUse.descriptionPrefix')}{' '}
          <Text style={styles.bold}>{t('privacyPolicyScreen.dataUse.descriptionBold')}</Text>
          {t('privacyPolicyScreen.dataUse.descriptionSuffix')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.dataUse.periodDates')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.dataUse.cycleLength')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.dataUse.symptoms')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.dataUse.notes')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.dataUse.settings')}
        </Text>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.dataUse.usage')}
        </Text>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.dataUse.deletion')}
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
            {t('privacyPolicyScreen.permissions.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.permissions.description')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.permissions.reminders')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.permissions.biometric')}
        </Text>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.permissions.revoke')}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye-outline" size={24} color={colors.primary} />
          <Text style={[typography.heading2, { marginLeft: 12 }]}>
            {t('privacyPolicyScreen.transparency.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.transparency.description')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.transparency.localStorage')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.transparency.noTransmission')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.transparency.deleteAnytime')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.transparency.noAnalytics')}
        </Text>
        <Text
          style={[
            typography.body,
            { marginBottom: 8, marginLeft: 8 },
          ]}
        >
          {t('privacyPolicyScreen.transparency.noAds')}
        </Text>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('privacyPolicyScreen.transparency.control')}
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
          {t('privacyPolicyScreen.footer')}
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
