import React from 'react';
import { SvgProps } from 'react-native-svg';
import AngrySvg from './angry.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const AngryIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <AngrySvg width={size} height={size} fill={color} {...props} />;
};