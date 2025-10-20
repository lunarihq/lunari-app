import React from 'react';
import { SvgProps } from 'react-native-svg';
import ConfusedSvg from './confused.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const ConfusedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <ConfusedSvg width={size} height={size} fill={color} {...props} />;
};