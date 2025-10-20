import React from 'react';
import { SvgProps } from 'react-native-svg';
import DiarheaSvg from './diarhea.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const DiarheaIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6580E2',
  ...props
}) => {
  return <DiarheaSvg width={size} height={size} fill={color} {...props} />;
};