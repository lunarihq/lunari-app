import React from 'react';
import { SvgProps } from 'react-native-svg';
import CreamySvg from './creamy.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CreamyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
  ...props
}) => {
  return <CreamySvg width={size} height={size} fill={color} {...props} />;
};
