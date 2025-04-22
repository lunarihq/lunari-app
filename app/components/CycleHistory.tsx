import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CycleData {
  startDate: string;
  cycleLength: string | number;
  periodLength: number;
}

interface CycleHistoryProps {
  cycles: CycleData[];
}

export function CycleHistory({ cycles }: CycleHistoryProps) {
  if (cycles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>{cycles.length} cycles logged</Text>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.startedCol]}>Started</Text>
          <Text style={[styles.headerText, styles.cycleCol]}>Cycle length</Text>
          <Text style={[styles.headerText, styles.periodCol]}>Period length</Text>
        </View>
        
        {cycles.map((cycle, index) => (
          <View key={index} style={[
            styles.dataRow,
            index === cycles.length - 1 && styles.lastRow
          ]}>
            <Text style={[styles.dataText, styles.startedCol]}>{cycle.startDate}</Text>
            <Text style={[styles.dataText, styles.cycleCol]}>
              {cycle.cycleLength}
            </Text>
            <Text style={[styles.dataText, styles.periodCol]}>{cycle.periodLength}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#332F49',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#878595',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#332F49',
  },
  dataText: {
    fontSize: 14,
    color: '#332F49',
  },
  startedCol: {
    flex: 1,
  },
  cycleCol: {
    flex: 1,
    textAlign: 'center',
  },
  periodCol: {
    flex: 1,
    textAlign: 'center',
  },
}); 