import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, createTypography } from '../../styles/theme';
import { createCommonStyles } from '../../styles/commonStyles';

export default function PeriodLength() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const commonStyles = createCommonStyles(colors);
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
      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.whatMeans.title')}
        </Text>

        <Text style={[typography.body]}>
          {t('latePeriod.whatMeans.description')}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.causes.title')}
        </Text>
        {[
          'stress', 'weight', 'exercise', 'sleep', 
          'illness', 'medications', 'pcos', 'pregnancy', 'perimenopause'
        ].map((cause, index) => (
          <Text key={cause} style={[typography.body, { marginBottom: index === 8 ? 0 : 12 }]}>
            {t(`latePeriod.causes.${cause}`)}
            <Text style={typography.bodyBold}>{t(`latePeriod.causes.${cause}Bold`)}</Text>
            {t(`latePeriod.causes.${cause}Suffix`)}
          </Text>
        ))}
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('latePeriod.seeDoctor.description')}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.whatToDo.title')}
        </Text>
        {['pregnancy', 'stress', 'weight', 'sleep', 'track', 'patience'].map((item, index) => (
          <Text key={item} style={[typography.body, { marginBottom: index === 5 ? 0 : 12 }]}>
            {t(`latePeriod.whatToDo.${item}`)}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
