import React from 'react';
import { SvgProps } from 'react-native-svg';
import ClumpyWhiteSvg from './clumpy-white.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const ClumpyWhiteIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9063E2',
  ...props
}) => {
  return (
    <ClumpyWhiteSvg width={size} height={size} fill={color} {...props} />
  );
};
