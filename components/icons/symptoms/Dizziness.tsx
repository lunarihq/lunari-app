import React from 'react';
import { SvgProps } from 'react-native-svg';
import DizzinessSvg from './dizziness.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const DizzinessIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <DizzinessSvg width={size} height={size} fill={color} {...props} />;
};