import React from 'react';
import { SvgProps } from 'react-native-svg';
import NoDischargeSvg from './no-discharge.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const NoDischargeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9469EC',
  ...props
}) => {
  return (
    <NoDischargeSvg width={size} height={size} fill={color} {...props} />
  );
};
