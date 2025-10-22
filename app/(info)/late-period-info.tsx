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
          {t('latePeriod.causes.stress')}{'\n'}
          {t('latePeriod.causes.weight')}{'\n'}
          {t('latePeriod.causes.exercise')}{'\n'}
          {t('latePeriod.causes.sleep')}{'\n'}
          {t('latePeriod.causes.illness')}{'\n'}
          {t('latePeriod.causes.medications')}{'\n'}
          {t('latePeriod.causes.pcos')}{'\n'}
          {t('latePeriod.causes.pregnancy')}{'\n'}
          {t('latePeriod.causes.perimenopause')}
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
