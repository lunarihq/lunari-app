import React from 'react';
import { SvgProps } from 'react-native-svg';
import BackacheSvg from './backache.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BackacheIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <BackacheSvg width={size} height={size} fill={color} {...props} />;
};