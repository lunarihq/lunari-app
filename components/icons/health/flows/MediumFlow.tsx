import React from 'react';
import { SvgProps } from 'react-native-svg';
import MediumFlowSvg from './medium-flow.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const MediumFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
  ...props
}) => {
  return <MediumFlowSvg width={size} height={size} fill={color} {...props} />;
};