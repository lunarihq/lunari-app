import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../app/styles/theme';
import { AlertIcon } from './icons/Alert';
import { CheckCircleIcon } from './icons/Check_Circle';


interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'normal' | 'irregular';
  type?: 'cycle' | 'period';
}

export function StatCard({ title, value, icon, status, type }: StatCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const getStatusIcon = () => {
    if (!status) return null;
    
    if (status === 'normal') {
      return (
        <CheckCircleIcon 
          size={16} 
          color="#10B981" 
        />
      );
    } else {
      return (
        <AlertIcon 
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
    return colors.textPrimary;
  };

  const handleInfoPress = () => {
    if (type) {
      const pathname = type === 'cycle' ? '/cycle-info' : '/period-info';
      router.push(pathname);
    }
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
      {type && (
        <TouchableOpacity
          onPress={handleInfoPress}
          style={styles.infoIcon}
          activeOpacity={0.7}
        >
          <Feather 
            name="info" 
            size={20} 
            color={colors.textSecondary}
          />
        </TouchableOpacity>
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
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
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
  infoIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 3,
  },
});

export default StatCard;
