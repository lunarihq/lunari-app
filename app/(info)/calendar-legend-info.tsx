import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function CalendarLegendInfo() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const legendItems = [
    {
      title: 'Period Days (Logged)',
      description: 'Days you marked as period days in your cycle.',
      indicator: (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 24,
            backgroundColor: colors.accentPink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.white, fontSize: 16 }}>15</Text>
        </View>
      ),
    },
    {
      title: 'Predicted Period Days',
      description:
        'Expected period days based on your cycle patterns. These are predictions for future cycles.',
      indicator: (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 24,
            backgroundColor: colors.accentPinkLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.accentPink, fontSize: 16 }}>22</Text>
        </View>
      ),
    },
    {
      title: 'Ovulation Day',
      description:
        'Your predicted ovulation day - typically occurs 14 days before your next period.',
      indicator: (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 24,
            borderWidth: 1.6,
            borderColor: colors.accentBlue,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.accentBlue, fontSize: 16 }}>14</Text>
        </View>
      ),
    },
    {
      title: 'Fertile Window',
      description:
        'Your fertile days - typically 5 days before ovulation and the day of ovulation.',
      indicator: (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.accentBlue, fontSize: 16 }}>12</Text>
        </View>
      ),
    },
    {
      title: 'Health Log Indicator',
      description:
        'Small dot below the date number indicates you tracked symptoms, mood, or flow on that day.',
      indicator: (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 16 }}>8</Text>
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              width: 6,
              height: 6,
              borderRadius: 8,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      ),
    },
  ];

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.panel, paddingTop: 16 },
      ]}
      contentContainerStyle={defaultTheme.globalStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >

      {legendItems.map((item, index) => (
        <View
          key={index}
          style={{
            marginBottom: 32,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ marginRight: 16, marginTop: 4 }}>{item.indicator}</View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.heading3, { marginBottom: 8 }]}>
              {item.title}
            </Text>
            <Text style={[typography.body, { lineHeight: 24 }]}>
              {item.description}
            </Text>
          </View>
        </View>
      ))}

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          About Predictions
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          Predictions are based on your average cycle length and period patterns.
          The more data you track, the more accurate your predictions become.
          Remember that predictions are estimates and your actual cycle may vary.
        </Text>
      </View>
    </ScrollView>
  );
}
