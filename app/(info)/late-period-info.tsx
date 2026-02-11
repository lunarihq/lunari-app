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
        source={require('../../assets/images/prediction.png')}
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
          {t('latePeriod.whatMeans.title')}
        </Text>

        <Text style={[typography.body]}>
          {t('latePeriod.whatMeans.description')}
        </Text>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.causes.title')}
        </Text>
        {[
          'stress', 'weight', 'exercise', 'sleep', 
          'illness', 'medications', 'pcos', 'pregnancy', 'perimenopause'
        ].map((cause, index) => (
          <View
            key={cause}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: index === 8 ? 0 : 8,
              marginLeft: 8,
            }}
          >
            <Text style={{ marginRight: 8, color: colors.textPrimary, fontSize: 18 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              <Text style={typography.bodyBold}>{t(`latePeriod.causes.${cause}Bold`)}</Text>
              {t(`latePeriod.causes.${cause}Suffix`)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.seeDoctor.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('latePeriod.seeDoctor.description')}
        </Text>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd, { marginBottom: 12 }]}>
          {t('latePeriod.whatToDo.title')}
        </Text>
        {['pregnancy', 'stress', 'weight', 'sleep', 'track', 'patience'].map((item, index) => (
          <View
            key={item}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: index === 5 ? 0 : 8,
              marginLeft: 8,
            }}
          >
            <Text style={{ marginRight: 8, color: colors.textPrimary, fontSize: 18 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              {t(`latePeriod.whatToDo.${item}`)}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styles.contentSection]}>
        <Text style={[typography.body]}>
          <Text style={typography.bodyBold}>{t('latePeriod.disclaimerBold')} </Text>
          {t('latePeriod.disclaimer')}
        </Text>
      </View>
      <View style={[styles.contentSection]}>
        <Text style={[typography.headingSm]}>
          {t('latePeriod.references.title')}
        </Text>
        <Text style={[typography.caption]}>
          {t('latePeriod.references.acog')}
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