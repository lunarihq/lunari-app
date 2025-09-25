import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function StatusInfo() {
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
          Understanding Your Cycle
        </Text>

        <Text style={[typography.body, { lineHeight: 24 }]}>
          Your menstrual cycle is the time from the first day of one period to the first day of the next period. This includes your period and the days between periods.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Normal Range
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          A normal cycle length of 21-35 days indicates regular ovulation and good reproductive health. Most people have cycles that vary by a few days each month, which is completely normal.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Irregular Cycles
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          Irregular cycles (shorter than 21 days or longer than 35 days) can be caused by stress, hormonal changes, medical conditions, or lifestyle factors. Tracking your cycles can help identify patterns.
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Tips for Tracking
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          • Track your cycles for at least 3-6 months to establish a pattern{'\n'}• Factors like stress, travel, and illness can affect cycle length{'\n'}• Consult a healthcare provider if irregular cycles persist{'\n'}• Regular exercise and balanced nutrition support cycle health
        </Text>
      </View>
    </ScrollView>
  );
}
