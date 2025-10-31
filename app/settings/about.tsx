import React from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';

const SECTION_ICON_SIZE = 24;

function SectionIcon({ name, ...props }: { name: keyof typeof Ionicons.glyphMap } & Partial<React.ComponentProps<typeof Ionicons>>) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={SECTION_ICON_SIZE} color={colors.accentPink} {...props} />;
}

export default function About() {
  const { colors } = useTheme();
  const { typography, commonStyles } = useAppStyles();
  const { t } = useTranslation('settings');
  const GITHUB_URL = 'https://github.com/lunari-app/lunari';
  const GPL_URL = 'https://www.gnu.org/licenses/gpl-3.0.en.html';

  return (
    <ScrollView
      style={[
        commonStyles.scrollView,
        { backgroundColor: 'colors.background' },
      ]}
      contentContainerStyle={[
        commonStyles.scrollContentContainer,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[commonStyles.sectionContainer]}>
        <Text style={[typography.headingLg, { marginBottom: 8, textAlign: 'center' }]}>
          {t('aboutScreen.title')}
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
          {t('aboutScreen.version')}
        </Text>
      </View>

      <View style={[commonStyles.sectionContainer]}>
        <View style={styles.sectionHeader}>
          <SectionIcon name="heart-outline" />
          <Text style={[typography.headingMd, { marginLeft: 12 }]}>
            {t('aboutScreen.whatIs.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.whatIs.description')}
        </Text>
      </View>

      <View style={[commonStyles.sectionContainer]}>
        <View style={styles.sectionHeader}>
          <SectionIcon name="calendar-outline" />
          <Text style={[typography.headingMd, { marginLeft: 12 }]}>
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

      <View style={[commonStyles.sectionContainer]}>
        <View style={styles.sectionHeader}>
          <SectionIcon name="shield-checkmark-outline" />
          <Text style={[typography.headingMd, { marginLeft: 12 }]}>
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

      <View style={[commonStyles.sectionContainer]}>
        <View style={styles.sectionHeader}>
          <SectionIcon name="document-text-outline" />
          <Text style={[typography.headingMd, { marginLeft: 12 }]}>
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

      <View style={[commonStyles.sectionContainer]}>
        <View style={styles.sectionHeader}>
          <SectionIcon name="code-outline" />
          <Text style={[typography.headingMd, { marginLeft: 12 }]}>
            {t('aboutScreen.technical.title')}
          </Text>
        </View>
        <Text style={[typography.body, { marginBottom: 12 }]}>
          {t('aboutScreen.technical.description')}
        </Text>
        {['framework', 'database', 'language', 'platform'].map((item) => {
          const fullText = t(`aboutScreen.technical.${item}`);
          const colonIndex = fullText.indexOf(':');
          const label = fullText.substring(0, colonIndex + 1);
          const value = fullText.substring(colonIndex + 1);
          
          return (
            <Text
              key={item}
              style={[
                typography.body,
                {marginBottom: 8, marginLeft: 8 },
              ]}
            >
              <Text style={typography.bodyBold}>{label}</Text>
              <Text>{value}</Text>
            </Text>
          );
        })}
      </View>

      <View style={[commonStyles.sectionContainer]}>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});
