import React from 'react';
import { SvgProps } from 'react-native-svg';
import VaginalDrynessSvg from './vaginal-dryness.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const DischargeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFCACB',
  ...props
}) => {
  return <VaginalDrynessSvg width={size} height={size} fill={color} {...props} />;
};
