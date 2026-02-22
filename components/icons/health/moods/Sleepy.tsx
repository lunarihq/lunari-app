import React from 'react';
import { SvgProps } from 'react-native-svg';
import SleepySvg from './sleepy.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const SleepyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <SleepySvg width={size} height={size} fill={color} {...props} />;
};
