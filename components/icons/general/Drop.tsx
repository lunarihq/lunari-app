import React from 'react';
import { SvgProps } from 'react-native-svg';
import DropSvg from './drop.svg';

interface IconProps extends SvgProps {
  size?: number;
}

export const DropIcon: React.FC<IconProps> = ({
  size = 12,
  ...props
}) => {
  return <DropSvg width={size} height={size} {...props} />;
};
