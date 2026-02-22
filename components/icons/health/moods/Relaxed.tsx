import React from 'react';
import { SvgProps } from 'react-native-svg';
import RelaxedSvg from './relaxed.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const RelaxedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <RelaxedSvg width={size} height={size} fill={color} {...props} />;
};
