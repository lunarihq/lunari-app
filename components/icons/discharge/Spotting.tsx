import React from 'react';
import { SvgProps } from 'react-native-svg';
import SpottingSvg from './spotting.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const SpottingIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9063E2',
  ...props
}) => {
  return <SpottingSvg width={size} height={size} fill={color} {...props} />;
};
