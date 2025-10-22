import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createTypography } from '../styles/theme';
import { CustomIcon } from './icons/health';
import { HealthItem } from '../constants/healthTracking';
import { useTranslation } from 'react-i18next';

interface HealthItemGridProps {
  items: readonly HealthItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  translationKey: string;
  selectionColor: string;
  iconSize?: number;
}

export function HealthItemGrid({
  items,
  selectedIds,
  onToggle,
  translationKey,
  selectionColor,
  iconSize = 50,
}: HealthItemGridProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation();

  return (
    <View style={styles.itemsGrid}>
      {items.map(item => {
        const isSelected = selectedIds.has(item.id);

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemButton}
            onPress={() => onToggle(item.id)}
          >
            <View
              style={[
                styles.itemIcon,
                isSelected && {
                  ...styles.selectedItemIcon,
                  borderColor: selectionColor,
                },
              ]}
            >
              <CustomIcon name={item.icon as any} size={iconSize} />
              {isSelected && (
                <View
                  style={[
                    styles.checkmarkContainer,
                    {
                      borderColor: colors.surface,
                      backgroundColor: selectionColor,
                    },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                </View>
              )}
            </View>
            <Text style={[typography.caption, { textAlign: 'center' }]}>
              {t(`${translationKey}.${item.id}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemButton: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  selectedItemIcon: {
    borderWidth: 2,
    borderRadius: 30,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
});

