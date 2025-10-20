import React from 'react';
import { SvgProps } from 'react-native-svg';
import EnergeticSvg from './energetic.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const EnergeticIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFEC7A',
  ...props
}) => {
  return <EnergeticSvg width={size} height={size} fill={color} {...props} />;
};