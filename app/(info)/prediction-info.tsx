import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function PredictionInfo() {
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
      <View>
        <View style={{ marginBottom: 32 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={[typography.heading2, { marginBottom: 12 }]}>
              Next Period Prediction
            </Text>
            <Text style={[typography.body, { lineHeight: 22 }]}>
              Your next period is predicted by adding your average cycle length
              to the start date of your most recent period.
            </Text>
          </View>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            Cycle Length Calculation
          </Text>
          <Text style={[typography.body, { lineHeight: 22, marginBottom: 16 }]}>
          Lunari calculates your average cycle length using a weighted average of your last 6 cycles, a commonly used approach in cycle tracking.
          </Text>
          <Text style={[typography.body, { lineHeight: 22 }]}>
          Recent cycles have more influence on predictions than older ones. For example, most recent cycle: 100%, second most recent: 80%, third most recent: 60%, and so on.
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            Ovulation & Fertility
          </Text>
          <Text style={[typography.body, { lineHeight: 22, marginBottom: 16 }]}>
            Ovulation is predicted to occur 14 days before your next expected
            period. Your fertile window includes:
          </Text>
          <Text style={[typography.caption]}>
            • 5 days before ovulation • Ovulation day • 1 day after ovulation
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 12 }]}>
            Accuracy Improves Over Time
          </Text>
          <Text style={[typography.body, { lineHeight: 22 }]}>
            The more periods you track, the more accurate predictions become.
            With 3+ cycles, Lunari can provide personalized predictions based on
            your unique patterns.
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={[typography.heading2, { marginBottom: 8 }]}>
            Privacy First
          </Text>
          <Text style={[typography.body, { lineHeight: 20 }]}>
            All calculations happen locally on your device. Your period data
            never leaves your phone and is never shared with anyone.
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
            🛎️ <Text style={{ fontWeight: 'bold' }}>Remember:</Text> These are
            predictions based on your patterns. Every body is different, and
            cycles can vary naturally.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
