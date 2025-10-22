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
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Understanding your cycle
        </Text>

        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>Cycle length</Text> is counted
          from the first day of one period to the first day of the next period.
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Normal range
        </Text>
        <Text style={[typography.body]}>
          According to the{' '}
          <Text style={{ fontWeight: 'bold' }}>
            American College of Obstetricians and Gynecologists (ACOG)¹
          </Text>
          , a normal menstrual cycle typically lasts between{' '}
          <Text style={{ fontWeight: 'bold' }}>21 and 35 days</Text>.
        </Text>
        <Text style={[typography.body]}>
          Most people have cycles that vary by a few days each month, which is
          completely normal.
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Irregular cycles
        </Text>
        <Text style={[typography.body]}>
          Irregular cycles are{' '}
          <Text style={{ fontWeight: 'bold' }}>
            shorter than 21 days or longer than 35 days
          </Text>{' '}
          and can be caused by a variety of reasons, such as:
        </Text>
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Hormonal changes
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Stress, travel, or disrupted sleep
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Medical conditions
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Polycystic ovary syndrome (PCOS)
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Significant weight change or intense exercise
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Puberty or perimenopause
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 6,
            }}
          >
            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
            <Text style={[typography.body, { flex: 1 }]}>
              Postpartum and breastfeeding
            </Text>
          </View>
          <Text style={[typography.body, { marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>
              Incorrectly entered period data
            </Text>{' '}
            can cause Lunari to indicate an abnormal cycle length. Most often,
            this is the result of forget to log period. Tracking your cycles for
            at least 3-6 months will help establish a pattern.
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          When to see a doctor?
        </Text>
        <Text style={[typography.body]}>
          If your cycles are frequently abnormal in length, or/and accompanied
          by other concerning symptoms, it’s best to talk to your health care
          provider. They can help you figure out the cause and suggest
          treatment, if necessary.
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>IMPORTANT! </Text>Lunari is not a
          diagnostic tool. The information from Lunari does not replace advice
          from a health care provider. Always seek the advice of your doctor or
          other qualified health provider with any questions you may have
          regarding your cycle.
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading3, { marginBottom: 12 }]}>
          References
        </Text>
        <Text style={[typography.caption]}>
          1. Diagnosis of Abnormal Uterine Bleeding in Reproductive-Aged Women.
          Practice Bulletin. Number 128, July 2012. American College of
          Obstetricians and Gynecologists.
        </Text>
      </View>
    </ScrollView>
  );
}
