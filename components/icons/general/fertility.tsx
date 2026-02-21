import React from 'react';
import { SvgProps } from 'react-native-svg';
import FertilitySvg from './fertility.svg';
import { useTheme } from '../../../contexts/ThemeContext';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const FertilityIcon: React.FC<IconProps> = ({
  size = 24,
  color,
  ...props
}) => {
  const { isDark } = useTheme();
  const iconColor = color || (isDark ? '#5F7CFF' : '#4B61C7');
  
  return <FertilitySvg width={size} height={size} color={iconColor} {...props} />;
};
