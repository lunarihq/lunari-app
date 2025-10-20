import React from 'react';
import { SvgProps } from 'react-native-svg';
import OkeySvg from './okey.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const OkeyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#D59E8D',
  ...props
}) => {
  return <OkeySvg width={size} height={size} fill={color} {...props} />;
};