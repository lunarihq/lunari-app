import React from 'react';
import { SvgProps } from 'react-native-svg';
import CalendarSvg from './calendar.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'black',
  ...props
}) => {
  return <CalendarSvg width={size} height={size} fill={color} {...props} />;
};
