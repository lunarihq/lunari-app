import React from 'react';
import { SvgProps } from 'react-native-svg';
import GrumpySvg from './grumpy.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const GrumpyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <GrumpySvg width={size} height={size} fill={color} {...props} />;
};
