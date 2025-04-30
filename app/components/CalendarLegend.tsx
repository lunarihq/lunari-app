import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function CalendarLegend() {
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={styles.periodDot} />
        <Text style={styles.legendText}>Period</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={styles.expectedPeriodDot} />
        <Text style={styles.legendText}>Expected period</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f2f2f2',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  periodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF597B',
    marginRight: 8,
  },
  expectedPeriodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FF597B',
    borderStyle: 'dashed',
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#332F49',
  },
}); 

export default CalendarLegend;