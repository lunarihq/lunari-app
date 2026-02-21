import React from 'react';
import { SvgProps } from 'react-native-svg';
import CycleSvg from './cycle.svg';
import { useTheme } from '../../../contexts/ThemeContext';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CycleIcon: React.FC<IconProps> = ({
  size = 24,
  color,
  ...props
}) => {
  const { isDark } = useTheme();
  const iconColor = color || (isDark ? '#7087F3' : '#5473E4');
  
  return <CycleSvg width={size} height={size} color={iconColor} {...props} />;
};
