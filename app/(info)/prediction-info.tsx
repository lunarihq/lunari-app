import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function PredictionInfo() {
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
      <View>
        <View style={{ marginBottom: 32 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={[typography.heading2, { marginBottom: 12 }]}>
              {t('prediction.nextPeriod.title')}
            </Text>
            <Text style={[typography.body]}>
              {t('prediction.nextPeriod.description')}
            </Text>
          </View>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            {t('prediction.cycleLengthCalc.title')}
          </Text>
          <Text style={[typography.body, { marginBottom: 16 }]}>
            {t('prediction.cycleLengthCalc.description')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.cycleLengthCalc.weighting')}
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            {t('prediction.ovulation.title')}
          </Text>
          <Text style={[typography.body, { marginBottom: 16 }]}>
            {t('prediction.ovulation.description')}
          </Text>
          <Text style={[typography.caption]}>
            {t('prediction.ovulation.fertileWindow')}
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            {t('prediction.accuracy.title')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.accuracy.description')}
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 8 }]}>
            {t('prediction.privacy.title')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.privacy.description')}
          </Text>
        </View>
        <View style={{ marginBottom: 32 }}>
          <Text
            style={[
              typography.caption,
              {
                backgroundColor: colors.surfaceVariant,
                padding: 16,
                borderRadius: 12,
              },
            ]}
          >
            {t('prediction.disclaimer')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
