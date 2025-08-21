import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../app/styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'normal' | 'irregular';
}

export function StatCard({ title, value, icon, status }: StatCardProps) {
  const { colors } = useTheme();

  const getStatusIcon = () => {
    if (!status) return null;
    
    if (status === 'normal') {
      return (
        <Feather 
          name="check-circle" 
          size={16} 
          color="#10B981" 
        />
      );
    } else {
      return (
        <Feather 
          name="alert-circle" 
          size={16} 
          color="#F59E0B" 
        />
      );
    }
  };

  const getStatusText = () => {
    if (!status) return null;
    return status === 'normal' ? 'Normal' : 'Irregular';
  };

  const getStatusColor = () => {
    if (!status) return colors.textPrimary;
    return status === 'normal' ? '#10B981' : '#F59E0B';
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.panel }]}>
      <View style={styles.header}>
        {icon}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      {status && (
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      )}
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
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StatCard;
