import React from 'react';
import { SvgProps } from 'react-native-svg';
import StressedSvg from './stressed.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const StressedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <StressedSvg width={size} height={size} fill={color} {...props} />;
};
