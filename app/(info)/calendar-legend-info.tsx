import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function CalendarLegendInfo() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const legendItems = [
    {
      title: 'Period days',
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: colors.accentPink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
    },
    {
      title: 'Future period prediction',
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: colors.accentPinkLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
    },
    {
      title: 'Ovulation day',
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            borderWidth: 1.6,
            borderColor: colors.accentBlue,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
    },
    {
      title: 'Fertile window',
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
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
      title: 'Symptoms log indicator',
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginTop: -6,
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              width: 7,
              height: 7,
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
      <Image
        source={require('../../assets/images/calendar.png')}
        style={{
          width: '100%',
          height: 300,
          marginBottom: 24,
          resizeMode: 'stretch',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#DADEE7',
        }}
      />
      {legendItems.map((item, index) => (
        <View
          key={index}
          style={{
            marginBottom: 32,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ marginRight: 12 }}>{item.indicator}</View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.body]}>{item.title}</Text>
          </View>
        </View>
      ))}

      <View style={{ marginBottom: 32 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Customize your calendar
        </Text>
        <Text style={[typography.body, { lineHeight: 24 }]}>
          You can hide ovulation and fertility indicators in <Text style={{ fontWeight: 'bold' }}>Settings → Calendar View</Text> if you prefer a simpler calendar display.
        </Text>
      </View>

    </ScrollView>
  );
}
