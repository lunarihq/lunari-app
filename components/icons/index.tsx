// components/icons/index.tsx
import React from 'react';
import { DropIcon } from './Drop';


interface IconProps {
  size?: number;
  color?: string;
}

export type IconName = 
  | 'acne' 
  | 'headache' 
  | 'cramps' 
  | 'dizziness'
  | 'fatigue'
  | 'bloating'
  | 'constipation'
  | 'cravings'
  | 'calm'
  | 'happy'
  | 'energetic'
  | 'sad'
  | 'anxious'
  | 'confused'
  | 'irritated'
  | 'angry'
  | 'emotional'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'blood-clots';

const iconMap: Record<IconName, React.FC<IconProps>> = {
  acne: DropIcon,
  headache: DropIcon,
  cramps: DropIcon,
  dizziness: DropIcon,
  fatigue: DropIcon,
  bloating: DropIcon,
  constipation: DropIcon,
  cravings: DropIcon,
  calm: DropIcon,
  happy: DropIcon,
  energetic: DropIcon,
  sad: DropIcon,
  anxious: DropIcon,
  confused: DropIcon,
  irritated: DropIcon,
  angry: DropIcon,
  emotional: DropIcon,
  light: DropIcon,
  medium: DropIcon,
  heavy: DropIcon,
  'blood-clots': DropIcon,
};

interface CustomIconProps extends IconProps {
  name: IconName;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};