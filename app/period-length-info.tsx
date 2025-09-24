import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../styles/theme';

export default function PeriodLength() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../assets/images/prediction.png')}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          marginBottom: 24,
        }}
      />
      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Understanding Your Period
        </Text>

        <Text style={[typography.body, { lineHeight: 24 }]}>
          Your period is the number of days you experience menstrual bleeding
          each cycle. This is when your body sheds the uterine lining that built
          up during your cycle.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Normal Period Length
        </Text>
        <Text style={[styles.normalRange]}>2-7 days</Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          A normal period length of 2-7 days is typical for most people. The
          flow usually starts light, becomes heavier for a few days, then tapers
          off. Period length can vary from cycle to cycle, which is completely
          normal.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Irregular Periods
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          Irregular periods (shorter than 2 days or longer than 7 days) may
          indicate hormonal imbalances, stress, or underlying health conditions.
          Very heavy bleeding or very light periods may need medical attention.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Period Flow Patterns
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          • Light flow: Minimal bleeding, may only need panty liners{'\n'}•
          Moderate flow: Regular tampon/pad changes every 4-6 hours{'\n'}• Heavy
          flow: Frequent changes every 2-3 hours{'\n'}• Very heavy: Soaking
          through protection in less than 2 hours
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Tips for Period Health
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          • Track your period length and flow intensity{'\n'}• Stay hydrated and
          maintain good nutrition{'\n'}• Use appropriate period products for
          your flow{'\n'}• Consider tracking symptoms like cramps or mood
          changes{'\n'}• Consult a healthcare provider if periods are
          consistently irregular{'\n'}• Rest when needed and listen to your body
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  normalRange: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#10B981',
  },
});


