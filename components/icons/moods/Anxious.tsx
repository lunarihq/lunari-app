import React from 'react';
import { SvgProps } from 'react-native-svg';
import AnxiousSvg from './anxious.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const AnxiousIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <AnxiousSvg width={size} height={size} fill={color} {...props} />;
};