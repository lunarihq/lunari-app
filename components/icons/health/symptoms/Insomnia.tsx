import React from 'react';
import { SvgProps } from 'react-native-svg';
import InsomniaSvg from './insomnia.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const InsomniaIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <InsomniaSvg width={size} height={size} fill={color} {...props} />;
};