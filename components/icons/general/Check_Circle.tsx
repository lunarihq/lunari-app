import React from 'react';
import { SvgProps } from 'react-native-svg';
import CheckCircleSvg from './check_circle.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#23CF6D',
  ...props
}) => {
  return <CheckCircleSvg width={size} height={size} fill={color} {...props} />;
};
