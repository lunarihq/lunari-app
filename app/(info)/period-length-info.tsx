import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';

export default function PeriodLength() {
  const { colors } = useTheme();
  const { typography, commonStyles, scrollContentContainerWithSafeArea } = useAppStyles();
  const { t } = useTranslation('info');

  return (
    <ScrollView
      style={[
        commonStyles.scrollView,
        { backgroundColor: colors.panel },
      ]}
      contentContainerStyle={scrollContentContainerWithSafeArea}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/images/period-info.png')}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          marginBottom: 24,
          borderRadius: 16,
        }}
      />
      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('periodLength.title')}
        </Text>

        <Text style={[typography.body]}>
          <Text style={typography.bodyBold}>{t('periodLength.definitionBold')}</Text>{' '}
          {t('periodLength.definitionText')}
        </Text>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('periodLength.normal.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.normal.acogPrefix')}{' '}
          <Text style={typography.bodyBold}>
            {t('periodLength.normal.acogName')}
          </Text>
          {t('periodLength.normal.acogSuffix')}{' '}
          <Text style={typography.bodyBold}>
            {t('periodLength.normal.daysRange')}
          </Text>.
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          {t('periodLength.normal.variation')}
        </Text>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('periodLength.irregular.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.irregular.description')}
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          <Text style={typography.bodyBold}>
            {t('periodLength.irregular.dataNoteBold')}
          </Text>{' '}
          {t('periodLength.irregular.dataNote')}
        </Text>
      </View>
      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('periodLength.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.seeDoctor.description')}
        </Text>
      </View>
      <View style={[styles.contentSection]}>
        <Text style={[typography.body]}>
          <Text style={typography.bodyBold}>{t('periodLength.disclaimerBold')} </Text>
          {t('periodLength.disclaimer')}
        </Text>
      </View>
      <View style={[styles.contentSection]}>
        <Text style={[typography.headingSm, { marginBottom: 12 }]}>
          {t('periodLength.references.title')}
        </Text>
        <Text style={[typography.caption]}>
          {t('periodLength.references.acog')}
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  contentSection: {
    marginBottom: 32,
  },
});