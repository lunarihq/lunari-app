// components/icons/index.tsx
import React from 'react';
import { HappyIcon } from './Happy';


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
  acne: HappyIcon,
  headache: HappyIcon,
  cramps: HappyIcon,
  dizziness: HappyIcon,
  fatigue: HappyIcon,
  bloating: HappyIcon,
  constipation: HappyIcon,
  cravings: HappyIcon,
  calm: HappyIcon,
  happy: HappyIcon,
  energetic: HappyIcon,
  sad: HappyIcon,
  anxious: HappyIcon,
  confused: HappyIcon,
  irritated: HappyIcon,
  angry: HappyIcon,
  emotional: HappyIcon,
  light: HappyIcon,
  medium: HappyIcon,
  heavy: HappyIcon,
  'blood-clots': HappyIcon,
};

interface CustomIconProps extends IconProps {
  name: IconName;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};