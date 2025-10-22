import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, createTypography } from '../../styles/theme';
import { commonStyles } from '../../styles/commonStyles';

export default function PeriodLength() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('info');

  return (
    <ScrollView
      style={[
        commonStyles.scrollView,
        { backgroundColor: colors.panel },
      ]}
      contentContainerStyle={commonStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/images/prediction.png')}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          marginBottom: 24,
          borderRadius: 16,
        }}
      />
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('periodLength.title')}
        </Text>

        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>{t('periodLength.definitionBold')}</Text>{' '}
          {t('periodLength.definitionText')}
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('periodLength.normal.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.normal.acogPrefix')}{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {t('periodLength.normal.acogName')}
          </Text>
          {t('periodLength.normal.acogSuffix')}{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {t('periodLength.normal.daysRange')}
          </Text>.
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          {t('periodLength.normal.variation')}
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('periodLength.irregular.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.irregular.description')}
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          <Text style={{ fontWeight: 'bold' }}>
            {t('periodLength.irregular.dataNoteBold')}
          </Text>{' '}
          {t('periodLength.irregular.dataNote')}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('periodLength.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('periodLength.seeDoctor.description')}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>{t('periodLength.disclaimerBold')} </Text>
          {t('periodLength.disclaimer')}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading3, { marginBottom: 12 }]}>
          {t('periodLength.references.title')}
        </Text>
        <Text style={[typography.caption]}>
          {t('periodLength.references.acog')}
        </Text>
      </View>
    </ScrollView>
  );
}
