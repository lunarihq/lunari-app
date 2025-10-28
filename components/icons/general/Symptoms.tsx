import React from 'react';
import { SvgProps } from 'react-native-svg';
import SymptomsSvg from './symptoms.svg';

interface IconProps extends SvgProps {
  size?: number;
}

export const SymptomsIcon: React.FC<IconProps> = ({
  size = 24,
  ...props
}) => {
  return <SymptomsSvg width={size} height={size} {...props} />;
};