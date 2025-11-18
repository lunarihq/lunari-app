import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { InfoIcon } from './icons/general/info';
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
  const { typography } = useAppStyles();
  const router = useRouter();
  const { t } = useTranslation('common');

  const getStatusIcon = () => {
    if (!status) return null;

    if (status === 'normal') {
      return <Ionicons name="checkmark-circle" size={20} color={colors.success} />;
    } else {
      return <Ionicons name="alert-circle" size={20} color={colors.warning} />;
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
            typography.displaySm,
            { marginTop: 2 },
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
            <InfoIcon size={20} color={colors.textSecondary} />
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
