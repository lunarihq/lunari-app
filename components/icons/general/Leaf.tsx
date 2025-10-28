import React from 'react';
import { SvgProps } from 'react-native-svg';
import LeafSvg from './leaf.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const LeafIcon: React.FC<IconProps> = ({
  size = 24,
  ...props
}) => {
  return <LeafSvg width={size} height={size} {...props} />;
};
