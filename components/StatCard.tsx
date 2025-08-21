import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../app/styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.panel }]}>
      <View style={styles.header}>
        {icon}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
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
  },
  title: {
    fontSize: 16,
    marginLeft: 4,
  },
});

export default StatCard;
