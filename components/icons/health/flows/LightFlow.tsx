import React from 'react';
import { SvgProps } from 'react-native-svg';
import LightFlowSvg from './light-flow.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const LightFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
  ...props
}) => {
  return <LightFlowSvg width={size} height={size} fill={color} {...props} />;
};