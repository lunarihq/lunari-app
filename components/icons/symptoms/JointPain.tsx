import React from 'react';
import { SvgProps } from 'react-native-svg';
import JointPainSvg from './joint-pain.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const JointPainIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#E34D4E',
  ...props
}) => {
  return <JointPainSvg width={size} height={size} fill={color} {...props} />;
};