import React from 'react';
import { SvgProps } from 'react-native-svg';
import DeleteSvg from './delete.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CycleIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#1C1B1F',
  ...props
}) => {
  return <DeleteSvg width={size} height={size} fill={color} color={color} {...props} />;
};