import React from 'react';
import { SvgProps } from 'react-native-svg';
import InfoSvg from './info.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const InfoIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#666666',
  ...props
}) => {
  return <InfoSvg width={size} height={size} fill={color} color={color} {...props} />;
};