import React from 'react';
import { SvgProps } from 'react-native-svg';
import MoodSwingsSvg from './mood-swings.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const MoodSwingsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <MoodSwingsSvg width={size} height={size} fill={color} {...props} />;
};