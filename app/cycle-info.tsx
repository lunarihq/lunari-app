import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../styles/theme';

export default function StatusInfo() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const getTitle = () => {
    return 'Understanding Your Cycle';
  };

  const getDescription = () => {
    return 'Your menstrual cycle is the time from the first day of one period to the first day of the next period. This includes your period and the days between periods.';
  };

  const getNormalRange = () => {
    return '21-35 days';
  };

  const getNormalExplanation = () => {
    return 'A normal cycle length of 21-35 days indicates regular ovulation and good reproductive health. Most people have cycles that vary by a few days each month, which is completely normal.';
  };

  const getIrregularExplanation = () => {
    return 'Irregular cycles (shorter than 21 days or longer than 35 days) can be caused by stress, hormonal changes, medical conditions, or lifestyle factors. Tracking your cycles can help identify patterns.';
  };

  const getTips = () => {
    return '• Track your cycles for at least 3-6 months to establish a pattern\n• Factors like stress, travel, and illness can affect cycle length\n• Consult a healthcare provider if irregular cycles persist\n• Regular exercise and balanced nutrition support cycle health';
  };

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
          {getTitle()}
        </Text>

        <Text style={[typography.body, { lineHeight: 24 }]}>
          {getDescription()}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Normal Range
        </Text>
        <Text style={[styles.normalRange]}>{getNormalRange()}</Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          {getNormalExplanation()}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Irregular Cycles
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          {getIrregularExplanation()}
        </Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Tips for Tracking
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>{getTips()}</Text>
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
