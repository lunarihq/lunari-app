import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function PeriodLength() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('info');

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.panel },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
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
          <Text style={{ fontWeight: 'bold' }}>Period length</Text>{' '}
          {t('periodLength.definition').replace('Period length is counted', 'is counted')}
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
            Incorrectly entered period data
          </Text>{' '}
          {t('periodLength.irregular.dataNote').replace('Incorrectly entered period data could be', 'could be')}
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
          <Text style={{ fontWeight: 'bold' }}>IMPORTANT! </Text>
          {t('periodLength.disclaimer').replace('IMPORTANT! ', '')}
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
