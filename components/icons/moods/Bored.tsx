import React from 'react';
import { SvgProps } from 'react-native-svg';
import BoredSvg from './bored.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BoredIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <BoredSvg width={size} height={size} fill={color} {...props} />;
};