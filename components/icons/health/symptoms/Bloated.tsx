import React from 'react';
import { SvgProps } from 'react-native-svg';
import BloatedSvg from './Bloated.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BloatedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#C7D3FF',
  ...props
}) => {
  return <BloatedSvg width={size} height={size} fill={color} {...props} />;
};
