import React from 'react';
import { SvgProps } from 'react-native-svg';
import BloodClotsSvg from './bloodcots.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BloodClotsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
  ...props
}) => {
  return <BloodClotsSvg width={size} height={size} fill={color} {...props} />;
};