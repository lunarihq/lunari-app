import React from 'react';
import { SvgProps } from 'react-native-svg';
import CrampsSvg from './cramps.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CrampsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#E34D4E',
  ...props
}) => {
  return <CrampsSvg width={size} height={size} fill={color} {...props} />;
};