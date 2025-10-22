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
      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('latePeriod.whatMeans.title')}
        </Text>

        <Text style={[typography.body]}>
          {t('latePeriod.whatMeans.description')}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('latePeriod.causes.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('latePeriod.causes.stress')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.stressBold')}</Text>
          {t('latePeriod.causes.stressSuffix')}{'\n'}
          {t('latePeriod.causes.weight')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.weightBold')}</Text>
          {t('latePeriod.causes.weightSuffix')}{'\n'}
          {t('latePeriod.causes.exercise')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.exerciseBold')}</Text>
          {t('latePeriod.causes.exerciseSuffix')}{'\n'}
          {t('latePeriod.causes.sleep')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.sleepBold')}</Text>
          {t('latePeriod.causes.sleepSuffix')}{'\n'}
          {t('latePeriod.causes.illness')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.illnessBold')}</Text>
          {t('latePeriod.causes.illnessSuffix')}{'\n'}
          {t('latePeriod.causes.medications')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.medicationsBold')}</Text>
          {t('latePeriod.causes.medicationsSuffix')}{'\n'}
          {t('latePeriod.causes.pcos')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.pcosBold')}</Text>
          {t('latePeriod.causes.pcosSuffix')}{'\n'}
          {t('latePeriod.causes.pregnancy')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.pregnancyBold')}</Text>
          {t('latePeriod.causes.pregnancySuffix')}{'\n'}
          {t('latePeriod.causes.perimenopause')}
          <Text style={typography.bodyBold}>{t('latePeriod.causes.perimenopauseBold')}</Text>
          {t('latePeriod.causes.perimenopauseSuffix')}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('latePeriod.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('latePeriod.seeDoctor.description')}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          {t('latePeriod.whatToDo.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('latePeriod.whatToDo.pregnancy')}{'\n'}
          {t('latePeriod.whatToDo.stress')}{'\n'}
          {t('latePeriod.whatToDo.weight')}{'\n'}
          {t('latePeriod.whatToDo.sleep')}{'\n'}
          {t('latePeriod.whatToDo.track')}{'\n'}
          {t('latePeriod.whatToDo.patience')}
        </Text>
      </View>
    </ScrollView>
  );
}
