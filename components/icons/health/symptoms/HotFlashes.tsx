import React from 'react';
import { SvgProps } from 'react-native-svg';
import HotFlashesSvg from './hot-flashes.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const HotFlashesIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <HotFlashesSvg width={size} height={size} fill={color} {...props} />;
};