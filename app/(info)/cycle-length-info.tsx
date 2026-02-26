import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';

export default function StatusInfo() {
  const { colors } = useTheme();
  const { typography, commonStyles, scrollContentContainerWithSafeArea } = useAppStyles();
  const { t } = useTranslation('info');

  return (
    <ScrollView
      style={[commonStyles.scrollView, { backgroundColor: colors.panel }]}
      contentContainerStyle={scrollContentContainerWithSafeArea}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/images/cycle-length.png')}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          marginBottom: 24,
          borderRadius: 16,
        }}
      />
      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd]}>
          {t('cycleLength.title')}
        </Text>

        <Text style={[typography.body]}>
          <Text style={typography.bodyBold}>{t('cycleLength.definitionBold')}</Text>{' '}
          {t('cycleLength.definitionText')}
        </Text>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.headingMd]}>
          {t('cycleLength.normalRange.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.normalRange.acogPrefix')}{' '}
          <Text style={typography.bodyBold}>
            {t('cycleLength.normalRange.acogName')}
          </Text>
          {t('cycleLength.normalRange.acogSuffix')}{' '}
          <Text style={typography.bodyBold}>
            {t('cycleLength.normalRange.daysRange')}
          </Text>.
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.normalRange.variation')}
        </Text>
      </View>

      <View style={{gap: 16, marginBottom: 32 }}>
        <Text style={[typography.headingMd]}>
          {t('cycleLength.irregular.title')}
        </Text>
        <Text style={[typography.body]}>
          {t('cycleLength.irregular.descriptionPrefix')}{' '}
          <Text style={typography.bodyBold}>
            {t('cycleLength.irregular.daysRange')}
          </Text>{' '}
          {t('cycleLength.irregular.descriptionSuffix')}
        </Text>

        <View>
          {['hormonal', 'stress', 'weight', 'lifestage', 'postpartum'].map((cause, index) => (
            <View
              key={cause}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index === 4 ? 0 : 8,
                marginLeft: 8,
              }}
            >
              <Text style={{ marginRight: 8, color: colors.textPrimary, fontSize: 18 }}>{'\u2022'}</Text>
              <Text style={[typography.body, { flex: 1 }]}>
                {t(`cycleLength.irregular.causes.${cause}`)}
              </Text>
            </View>
          ))}

          <View style={{ marginTop: 16}}>
          <Text style={[typography.body]}>
            <Text style={[typography.bodyBold]}>
              {t('cycleLength.irregular.dataNoteBold')}
            </Text>{' '}
            {t('cycleLength.irregular.dataNote')}
          </Text>
          </View>
        </View>
      </View>

      <View style={[styles.contentSection]}>
        <Text style={[typography.body]}>
          <Text style={typography.bodyBold}>{t('cycleLength.disclaimerBold')} </Text>
          {t('cycleLength.disclaimer')}
        </Text>
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