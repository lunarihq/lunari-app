import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function PeriodLength() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

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
          What Does "Late" Mean?
        </Text>

        <Text style={[typography.body, { lineHeight: 24 }]}>
          A period is generally considered late when it's more than 5-7 days past your expected date. Cycles can naturally vary by a few days each month, so occasional lateness is normal.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Common Causes
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          • Stress: High stress affects hormones that regulate your cycle{'\n'}
          • Weight changes: Significant gain or loss can delay periods{'\n'}
          • Exercise: Intense training can temporarily stop menstruation{'\n'}
          • Sleep disruption: Irregular sleep patterns affect hormones{'\n'}
          • Illness: Being sick can throw off your cycle timing{'\n'}
          • Medications: Birth control, antibiotics, and other drugs{'\n'}
          • PCOS: Polycystic ovary syndrome causes irregular cycles{'\n'}
          • Pregnancy: Obviously, the most common reason{'\n'}
          • Perimenopause: Natural transition before menopause
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          When to See a Doctor
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          Consult a healthcare provider if your period is more than 3 months late, if you experience severe pain, or if you've had unprotected sex and could be pregnant. Sudden changes in cycle regularity also warrant a check-up.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          What You Can Do
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          • Take a pregnancy test if there's any possibility{'\n'}
          • Manage stress through meditation, exercise, or therapy{'\n'}
          • Maintain a healthy weight for your body{'\n'}
          • Get consistent, quality sleep{'\n'}
          • Track your cycles to identify patterns{'\n'}
          • Be patient, occasional irregularity is normal
        </Text>
      </View>
    </ScrollView>
  );
}
