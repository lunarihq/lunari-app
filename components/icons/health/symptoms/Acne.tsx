import React from 'react';
import { SvgProps } from 'react-native-svg';
import AcneSvg from './acne.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const AcneIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <AcneSvg width={size} height={size} fill={color} {...props} />;
};