import React from 'react';
import { SvgProps } from 'react-native-svg';
import CravingsSvg from './cravings.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CravingsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#F83565',
  ...props
}) => {
  return <CravingsSvg width={size} height={size} fill={color} {...props} />;
};