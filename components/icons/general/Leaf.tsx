import React from 'react';
import { SvgProps } from 'react-native-svg';
import LeafSvg from './leaf.svg';
import { useTheme } from '../../../contexts/ThemeContext';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const LeafIcon: React.FC<IconProps> = ({
  size = 24,
  color,
  ...props
}) => {
  const { isDark } = useTheme();
  const iconColor = color || (isDark ? '#7087F3' : '#4B61C7');
  
  return <LeafSvg width={size} height={size} color={iconColor} {...props} />;
};
