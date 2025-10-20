import React from 'react';
import { SvgProps } from 'react-native-svg';
import NauseaSvg from './nausea.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const NauseaIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <NauseaSvg width={size} height={size} fill={color} {...props} />;
};