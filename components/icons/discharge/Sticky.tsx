import React from 'react';
import { SvgProps } from 'react-native-svg';
import StickySvg from './sticky.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const StickyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
  ...props
}) => {
  return <StickySvg width={size} height={size} fill={color} {...props} />;
};
