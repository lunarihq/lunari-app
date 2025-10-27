import React from 'react';
import { Text, View, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';

type FABProps = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  fabStyle?: ViewStyle;
};

export const FAB = ({
  onPress,
  icon = 'add',
  iconSize = 32,
  label,
  labelStyle,
  containerStyle,
  fabStyle,
}: FABProps) => {
  const { colors } = useTheme();
  const { commonStyles } = useAppStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ alignItems: 'center' }, containerStyle]}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.fab, fabStyle]}>
        <Ionicons name={icon} size={iconSize} color={colors.white} />
      </View>
      {label && (
        <Text
          style={[
            {
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
              color: colors.textSecondary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default FAB;
