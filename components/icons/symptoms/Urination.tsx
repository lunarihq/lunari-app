import React from 'react';
import { SvgProps } from 'react-native-svg';
import UrinationSvg from './urination.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const UrinationIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6580E2',
  ...props
}) => {
  return <UrinationSvg width={size} height={size} fill={color} {...props} />;
};