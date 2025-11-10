import React from 'react';
import { SvgProps } from 'react-native-svg';
import CalendarSvg from './calendar.svg';
import { useTheme } from '../../../contexts/ThemeContext';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color,
  ...props
}) => {
  const { isDark } = useTheme();
  const iconColor = color || (isDark ? '#7087F3' : '#4B61C7');
  
  return <CalendarSvg width={size} height={size} color={iconColor} {...props} />;
};
