import React from 'react';
import { SvgProps } from 'react-native-svg';
import EggWhiteSvg from './egg-white.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const EggWhiteIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
  ...props
}) => {
  return <EggWhiteSvg width={size} height={size} {...props} />;
};
