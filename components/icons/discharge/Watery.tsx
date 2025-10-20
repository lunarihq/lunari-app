import React from 'react';
import { SvgProps } from 'react-native-svg';
import WaterySvg from './watery.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const WateryIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
  ...props
}) => {
  return <WaterySvg width={size} height={size} stroke={color} {...props} />;
};
