import React from 'react';
import { SvgProps } from 'react-native-svg';
import HappySvg from './happy.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const HappyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
  ...props
}) => {
  return <HappySvg width={size} height={size} fill={color} {...props} />;
};