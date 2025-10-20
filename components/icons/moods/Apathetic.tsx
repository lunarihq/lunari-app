import React from 'react';
import { SvgProps } from 'react-native-svg';
import ApatheticSvg from './apathetic.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const ApaticIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <ApatheticSvg width={size} height={size} fill={color} {...props} />;
};