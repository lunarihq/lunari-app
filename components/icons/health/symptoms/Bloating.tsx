import React from 'react';
import { SvgProps } from 'react-native-svg';
import BloatingSvg from './bloating.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const BloatingIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#C7D3FF',
  ...props
}) => {
  return <BloatingSvg width={size} height={size} fill={color} {...props} />;
};
