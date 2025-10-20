import React from 'react';
import { SvgProps } from 'react-native-svg';
import SadSvg from './sad.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const SadIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <SadSvg width={size} height={size} fill={color} {...props} />;
};