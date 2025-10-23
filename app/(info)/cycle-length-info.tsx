import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, createTypography } from '../../styles/theme';
import { commonStyles } from '../../styles/commonStyles';
export default function StatusInfo() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('info');

  return (
    <ScrollView
      style={[commonStyles.scrollView, { backgroundColor: colors.panel }]}
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
          {t('cycleLength.title')}
        </Text>

        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>{t('cycleLength.definitionBold')}</Text>{' '}
          {t('cycleLength.definitionText')}
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('cycleLength.normalRange.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.normalRange.acogPrefix')}{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {t('cycleLength.normalRange.acogName')}
          </Text>
          {t('cycleLength.normalRange.acogSuffix')}{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {t('cycleLength.normalRange.daysRange')}
          </Text>.
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.normalRange.variation')}
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('cycleLength.irregular.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.irregular.descriptionPrefix')}{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {t('cycleLength.irregular.daysRange')}
          </Text>{' '}
          {t('cycleLength.irregular.descriptionSuffix')}
        </Text>
        <View style={{ marginTop: 12 }}>
          {['hormonal', 'stress', 'medical', 'pcos', 'weight', 'lifestage', 'postpartum'].map((cause, index) => (
            <View
              key={cause}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index === 6 ? 0 : 6,
              }}
            >
              <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
              <Text style={[typography.body, { flex: 1 }]}>
                {t(`cycleLength.irregular.causes.${cause}`)}
              </Text>
            </View>
          ))}
          <Text style={[typography.body, { marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>
              {t('cycleLength.irregular.dataNoteBold')}
            </Text>{' '}
            {t('cycleLength.irregular.dataNote')}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('cycleLength.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.seeDoctor.description')}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>{t('cycleLength.disclaimerBold')} </Text>
          {t('cycleLength.disclaimer')}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading3, { marginBottom: 12 }]}>
          {t('cycleLength.references.title')}
        </Text>
        <Text style={[typography.caption]}>
          {t('cycleLength.references.acog')}
        </Text>
      </View>
    </ScrollView>
  );
}
