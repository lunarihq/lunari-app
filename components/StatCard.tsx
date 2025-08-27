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
    if (!status) return colors.textSecondary;
    return colors.textSecondary;
  };

  const handleInfoPress = () => {
    if (type) {
      const pathname = type === 'cycle' ? '/cycle-info' : '/period-info';
      router.push(pathname);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.neutral200 }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      </View>
      <View style={styles.rightContainer}>
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
        {status && (
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default StatCard;

