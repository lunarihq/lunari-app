// components/icons/index.tsx
import React from 'react';
import { HappyIcon } from './moods/Happy';
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
import { MediumFlowIcon } from './flows/MediumFlow';
import { HeavyFlowIcon } from './flows/HeavyFlow';
import { BloodClotsIcon } from './flows/BloodClots';
import { CrampsIcon } from './symptoms/Cramps';
import { DiarheaIcon } from './symptoms/Diarhea';
import { OkeyIcon } from './symptoms/Okey';
import { FatigueIcon } from './symptoms/Fatigue';
import { CravingsIcon } from './symptoms/Cravings';
import { BloatedIcon } from './symptoms/Bloated';
import { NauseaIcon } from './symptoms/Nausea';
import { DischargeIcon } from './symptoms/Discharge';
import { UrinationIcon } from './symptoms/Urination';
import { HeadacheIcon } from './symptoms/Headache';
import { SweatsIcon } from './symptoms/Sweats';
import { JointPainIcon } from './symptoms/JointPain';

interface IconProps {
  size?: number;
  color?: string;
}

export type IconName =
  | 'joint-pain'
  | 'im-okay'
  | 'nausea'
  | 'night-sweats'
  | 'vaginal dryness'
  | 'frequent-urination'
  | 'apathetic'
  | 'headache'
  | 'cramps'
  | 'dizziness'
  | 'diarhea'
  | 'cramping'
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
  'joint-pain': JointPainIcon,
  'im-okay': OkeyIcon,
  nausea: NauseaIcon,
  'vaginal dryness': DischargeIcon,
  'night-sweats': SweatsIcon,
  'frequent-urination': UrinationIcon,
  apathetic: ApaticIcon,
  headache: HeadacheIcon,
  cramps: CrampsIcon,
  dizziness: BloatedIcon,
  fatigue: FatigueIcon,
  bloating: BloatedIcon,
  bored: BoredIcon,
  constipation: BloatedIcon,
  cravings: CravingsIcon,
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
  diarhea: DiarheaIcon,
  cramping: CrampsIcon,
  light: LightFlowIcon,
  medium: MediumFlowIcon,
  heavy: HeavyFlowIcon,
  'blood-clots': BloodClotsIcon,
};

interface CustomIconProps extends IconProps {
  name: IconName;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};
