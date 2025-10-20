import React from 'react';
import { SvgProps } from 'react-native-svg';
import HeavyFlowSvg from './heavy-flow.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const HeavyFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
  ...props
}) => {
  return <HeavyFlowSvg width={size} height={size} fill={color} {...props} />;
};