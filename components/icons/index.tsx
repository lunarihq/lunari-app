// components/icons/index.tsx
import React from 'react';
import { HappyIcon } from './moods/Happy';
import { BloatedIcon } from './symptoms/Bloated';
import { AngryIcon } from './moods/Angry';
import { SadIcon } from './moods/Sad';
import { AnxiousIcon } from './moods/Anxious';
import { FriskyIcon } from './moods/Frisky';
import { ConfusedIcon } from './moods/Confused';
import { ApatheticIcon } from './moods/Apathetic';

interface IconProps {
  size?: number;
  color?: string;
}

export type IconName =
  | 'acne'
  | 'apathetic'
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
  | 'frisky'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'blood-clots';

const iconMap: Record<IconName, React.FC<IconProps>> = {
  acne: HappyIcon,
  apathetic: ApatheticIcon,
  headache: BloatedIcon,
  cramps: HappyIcon,
  dizziness: HappyIcon,
  fatigue: HappyIcon,
  bloating: HappyIcon,
  constipation: HappyIcon,
  cravings: HappyIcon,
  calm: HappyIcon,
  happy: HappyIcon,
  energetic: HappyIcon,
  sad: SadIcon,
  anxious: AnxiousIcon,
  confused: ConfusedIcon,
  irritated: HappyIcon,
  angry: AngryIcon,
  emotional: HappyIcon,
  frisky: FriskyIcon,
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
