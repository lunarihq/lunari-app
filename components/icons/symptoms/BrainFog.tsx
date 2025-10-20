import React from 'react';
import { SvgProps } from 'react-native-svg';
import BrainFogSvg from './brain-frog.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BrainFogIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <BrainFogSvg width={size} height={size} fill={color} {...props} />;
};