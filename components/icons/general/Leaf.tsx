import React from 'react';
import { SvgProps } from 'react-native-svg';
import LeafSvg from './leaf.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const LeafIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#1C1B1F',
  ...props
}) => {
  return <LeafSvg width={size} height={size} fill={color} color={color} {...props} />;
};
