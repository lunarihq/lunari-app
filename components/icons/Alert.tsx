import React from 'react';
import { SvgProps } from 'react-native-svg';
import AlertSvg from './alert.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const AlertIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFC71F',
  ...props
}) => {
  return <AlertSvg width={size} height={size} fill={color} {...props} />;
};
