import React from 'react';
import { SvgProps } from 'react-native-svg';
import FriskySvg from './frisky.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const FriskyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <FriskySvg width={size} height={size} fill={color} {...props} />;
};