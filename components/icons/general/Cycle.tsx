import React from 'react';
import { SvgProps } from 'react-native-svg';
import CycleSvg from './cycle.svg';

interface IconProps extends SvgProps {
  size?: number;
}

export const CycleIcon: React.FC<IconProps> = ({
  size = 24,
  ...props
}) => {
  return <CycleSvg width={size} height={size} {...props} />;
};
