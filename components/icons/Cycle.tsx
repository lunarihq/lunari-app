import React from 'react';
import { SvgProps } from 'react-native-svg';
import CycleSvg from './cycle.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CycleIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#1C1B1F',
  ...props
}) => {
  return <CycleSvg width={size} height={size} stroke={color} fill={color} {...props} />;
};
