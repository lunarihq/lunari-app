import React from 'react';
import { SvgProps } from 'react-native-svg';
import CalmSvg from './calm.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CalmIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <CalmSvg width={size} height={size} fill={color} {...props} />;
};