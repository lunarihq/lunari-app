// components/icons/index.tsx
import React from 'react';
import { HappyIcon } from './moods/Happy';
import { BloatedIcon } from './symptoms/Bloated';
import { AngryIcon } from './moods/Angry';
import { SadIcon } from './moods/Sad';
import { AnxiousIcon } from './moods/Anxious';
import { FriskyIcon } from './moods/Frisky';
import { ConfusedIcon } from './moods/Confused';
import { ApaticIcon } from './moods/Apathetic';
import { MoodSwingsIcon } from './moods/MoodSwings';
import { IrritatedIcon } from './moods/Irritated';
import { CalmIcon } from './moods/Calm';
import { BoredIcon } from './moods/Bored';
import { LightFlowIcon } from './flows/LightFlow';

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
  | 'bored'
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
  | 'mood-swings'
  | 'frisky'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'blood-clots';

const iconMap: Record<IconName, React.FC<IconProps>> = {
  acne: BloatedIcon,
  apathetic: ApaticIcon,
  headache: BloatedIcon,
  cramps: BloatedIcon,
  dizziness: BloatedIcon,
  fatigue: BloatedIcon,
  bloating: BloatedIcon,
  bored: BoredIcon,
  constipation: BloatedIcon,
  cravings: BloatedIcon,
  calm: CalmIcon,
  happy: HappyIcon,
  energetic: HappyIcon,
  sad: SadIcon,
  anxious: AnxiousIcon,
  confused: ConfusedIcon,
  irritated: IrritatedIcon,
  angry: AngryIcon,
  'mood-swings': MoodSwingsIcon,
  frisky: FriskyIcon,
  light: LightFlowIcon,
  medium: LightFlowIcon,
  heavy: LightFlowIcon,
  'blood-clots': LightFlowIcon,
};

interface CustomIconProps extends IconProps {
  name: IconName;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};
