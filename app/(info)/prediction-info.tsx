import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';
export default function PredictionInfo() {
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
          <View style={styles.contentSection}>
            <Text style={[typography.headingMd]}>
              {t('prediction.nextPeriod.title')}
            </Text>
            <Text style={[typography.body]}>
              {t('prediction.nextPeriod.description')}
            </Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={[typography.headingMd]}>
            {t('prediction.cycleLengthCalc.title')}
            </Text>
            <Text style={[typography.body]}>
              {t('prediction.cycleLengthCalc.description')}
            </Text>
            <Text style={[typography.body]}>
              {t('prediction.cycleLengthCalc.weighting')}
            </Text>
          </View>

        <View style={styles.contentSection}>
          <Text style={[typography.headingMd]}>
            {t('prediction.ovulation.title')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.ovulation.description')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.ovulation.fertileWindow')}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={[typography.headingMd]}>
            {t('prediction.accuracy.title')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.accuracy.description')}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={[typography.headingMd]}>
            {t('prediction.privacy.title')}
          </Text>
          <Text style={[typography.body]}>
            {t('prediction.privacy.description')}
          </Text>
        </View>

        <View style={styles.contentSection}>
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
            {t('prediction.disclaimerPrefix')}
            <Text style={typography.captionBold}>{t('prediction.disclaimerBold')}</Text>
            {t('prediction.disclaimerSuffix')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  contentSection: {
    marginBottom: 32,
    gap: 16,
  },
});