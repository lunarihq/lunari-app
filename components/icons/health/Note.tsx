import React from 'react';
import { SvgProps } from 'react-native-svg';
import NoteSvg from './note.svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export const NoteIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#11A454',
  ...props
}) => {
  return <NoteSvg width={size} height={size} fill={color} {...props} />;
};

export default NoteIcon;
