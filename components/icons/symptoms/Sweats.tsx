import React from 'react';
import { SvgProps } from 'react-native-svg';
import SweatsSvg from './sweats.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const SweatsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6580E2',
  ...props
}) => {
  return <SweatsSvg width={size} height={size} fill={color} {...props} />;
};