import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const NoDischargeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9469EC',
}) => (
  <Svg width={size} height={size} viewBox="0 0 62 62" fill="none">
    <Circle cx="31" cy="31" r="31" fill="#DED2FA" />
    <Path
      d="M46 35.7534C46 44.8526 39.2843 52.2289 31 52.2289C22.7157 52.2289 16 44.8526 16 35.7534C16 26.9174 24.0182 16.7009 28.3299 11.8459C29.7737 10.2202 32.2263 10.2202 33.6701 11.8459C37.9818 16.7009 46 26.9173 46 35.7534Z"
      fill={color}
    />
    <Path
      d="M13 18L45 50"
      stroke="#9268E8"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <Path
      d="M17 15L49 47"
      stroke="#DDD0FB"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
  </Svg>
);
