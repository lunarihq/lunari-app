import React from 'react';
import { SvgProps } from 'react-native-svg';
import ConstipationSvg from './constipation.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const ConstipationIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
  ...props
}) => {
  return <ConstipationSvg width={size} height={size} fill={color} {...props} />;
};