import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const CycleIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#1C1B1F',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.38125 5.78323C6.71565 5.49447 6.75265 4.98929 6.46389 4.65488C6.17513 4.32048 5.66995 4.28348 5.33554 4.57224L5.8584 5.17773L6.38125 5.78323ZM21.4978 12.3404H20.6978C20.6978 17.1231 16.8207 21.0003 12.038 21.0003V21.8003V22.6003C17.7043 22.6003 22.2978 18.0068 22.2978 12.3404H21.4978ZM2.57812 12.3404H3.37813C3.37813 9.72021 4.54085 7.37244 6.38125 5.78323L5.8584 5.17773L5.33554 4.57224C3.15817 6.45243 1.77812 9.23572 1.77812 12.3404H2.57812ZM12.038 21.8003V21.0003C7.25527 21.0003 3.37813 17.1231 3.37813 12.3404H2.57812H1.77812C1.77812 18.0068 6.37161 22.6003 12.038 22.6003V21.8003Z"
      fill={color}
    />
    <Circle
      cx="4.15328"
      cy="17.1533"
      r="2.42828"
      fill="white"
      stroke={color}
      strokeWidth="1.45"
    />
    <Path
      d="M11.3917 3.79992C16.6162 3.79993 20.8516 8.03524 20.8516 13.2598"
      stroke={color}
      strokeWidth="3.21554"
      strokeLinecap="round"
    />
  </Svg>
);
