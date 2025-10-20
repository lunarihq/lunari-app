import React from 'react';
import { SvgProps } from 'react-native-svg';
import GreyDischargeSvg from './grey-discharge.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const GreyDischargeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#A3A3A3',
  ...props
}) => {
  return (
    <GreyDischargeSvg width={size} height={size} fill={color} {...props} />
  );
};
