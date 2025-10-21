import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, createTypography } from '../styles/theme';
import { AlertIcon } from './icons/general/Alert';
import { CheckCircleIcon } from './icons/general/Check_Circle';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'normal' | 'irregular';
  type?: 'cycle' | 'period';
}

export function StatCard({ title, value, icon, status, type }: StatCardProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const router = useRouter();
  const { t } = useTranslation('common');

  const getStatusIcon = () => {
    if (!status) return null;

    if (status === 'normal') {
      return <CheckCircleIcon size={20} color={colors.success} />;
    } else {
      return <AlertIcon size={20} color={colors.warning} />;
    }
  };

  const getStatusText = () => {
    if (!status) return null;
    return status === 'normal' ? t('status.normal') : t('status.irregular');
  };

  const getStatusColor = () => {
    if (!status) return colors.textSecondary;
    return colors.textSecondary;
  };

  const handleInfoPress = () => {
    if (type) {
      const pathname =
        type === 'cycle'
          ? '/(info)/cycle-length-info'
          : '/(info)/period-length-info';
      router.push(pathname);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceVariant }]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surfaceVariant2 },
        ]}
      >
        {icon}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          {title}
        </Text>
        <Text
          style={[
            typography.heading2,
            { fontSize: 24, fontWeight: 'bold', marginTop: 2 },
          ]}
        >
          {value}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        {type && (
          <TouchableOpacity
            onPress={handleInfoPress}
            style={styles.infoIcon}
            activeOpacity={0.7}
          >
            <Feather name="info" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        {status && (
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text style={[typography.caption, { color: getStatusColor() }]}>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
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
});

export default StatCard;
