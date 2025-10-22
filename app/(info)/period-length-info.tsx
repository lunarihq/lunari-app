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
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Understanding your period
        </Text>

        <Text style={[typography.body]}>
          <Text style={{ fontWeight: 'bold' }}>Period length</Text> is counted
          from the first until the last day of menstrual bleeding of any volume.
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Normal period length
        </Text>
        <Text style={[typography.body]}>
          According to the{' '}
          <Text style={{ fontWeight: 'bold' }}>
            American College of Obstetricians and Gynecologists (ACOG)¹
          </Text>
          , a normal period length typically lasts between{' '}
          <Text style={{ fontWeight: 'bold' }}>2 and 7 days</Text>.
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          Period length can vary from cycle to cycle, which is completely
          normal.
        </Text>
      </View>

      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          Irregular periods
        </Text>
        <Text style={[typography.body]}>
          Irregular periods (shorter than 2 days or longer than 7 days) might be
          caused by lifestyle changes, medication, stress, travel, and a few
          other factors that can affect hormone levels.
        </Text>
        <Text style={[typography.body, { marginTop: 12 }]}>
          <Text style={{ fontWeight: 'bold' }}>
            Incorrectly entered period data
          </Text>{' '}
          could be the reason your period length is labeled prolonged or
          shortened. You can always correct any event of you cycle
          retrospectively on the calendar menu.{' '}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={[typography.heading2, { marginBottom: 12 }]}>
          When to see a doctor?
        </Text>
        <Text style={[typography.body]}>
          If your period length is frequently abnormal in length, or/and
          accompanied by other concerning symptoms, it’s best to talk to your
          health care provider. They can help you figure out the cause and
          suggest treatment, if necessary.
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
          1. Your First Period. American College of Obstetricians and
          Gynecologists. FAQ for patients.
        </Text>
      </View>
    </ScrollView>
  );
}
