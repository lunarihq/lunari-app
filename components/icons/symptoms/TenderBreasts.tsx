import React from 'react';
import { SvgProps } from 'react-native-svg';
import TenderBreastsSvg from './tender-breasts.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const TenderBreastsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <TenderBreastsSvg width={size} height={size} fill={color} {...props} />;
};