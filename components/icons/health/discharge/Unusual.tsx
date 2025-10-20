import React from 'react';
import { SvgProps } from 'react-native-svg';
import UnusualSvg from './unusual.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const UnusualIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9063E2',
  ...props
}) => {
  return <UnusualSvg width={size} height={size} fill={color} {...props} />;
};
