import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../app/styles/colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5FF',
    borderRadius: 12,
    padding: 16,
    width: 168,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
  },
  title: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 8,
  },
});

export default StatCard; 