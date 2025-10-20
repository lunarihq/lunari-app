import React from 'react';
import { SvgProps } from 'react-native-svg';
import FatigueSvg from './fatigue.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const FatigueIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#EA4843',
  ...props
}) => {
  return <FatigueSvg width={size} height={size} fill={color} {...props} />;
};