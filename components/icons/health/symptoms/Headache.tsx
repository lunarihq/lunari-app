import React from 'react';
import { SvgProps } from 'react-native-svg';
import HeadacheSvg from './headache.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const HeadacheIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <HeadacheSvg width={size} height={size} fill={color} {...props} />;
};