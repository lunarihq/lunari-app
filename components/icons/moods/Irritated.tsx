import React from 'react';
import { SvgProps } from 'react-native-svg';
import IrritatedSvg from './irritated.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const IrritatedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <IrritatedSvg width={size} height={size} fill={color} {...props} />;
};