import React from 'react';
import { SvgProps } from 'react-native-svg';
import DropSvg from './drop.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const DropIcon: React.FC<IconProps> = ({
  size = 12,
  color = 'black',
  ...props
}) => {
  return <DropSvg width={size} height={size} fill={color} {...props} />;
};
