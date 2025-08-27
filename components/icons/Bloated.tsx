import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const BloatedIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#DFD0F9',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
      fill={color}
    />
    <Circle cx="11.9082" cy="10.3262" r="7.3457" fill="#9168EA" />
    <Path
      d="M11.5703 6.318C12.5159 6.20675 14.4072 6.32296 15.2415 8.98836"
      stroke="white"
      strokeWidth="2.00337"
      strokeLinecap="round"
    />
    <Path
      d="M9.24219 18.5066C9.24219 18.0456 9.61591 17.6719 10.0769 17.6719H13.7498C14.2108 17.6719 14.5845 18.0456 14.5845 18.5066C14.5845 18.9676 14.2108 19.3414 13.7498 19.3414H10.0769C9.61591 19.3414 9.24219 18.9676 9.24219 18.5066Z"
      fill="#3C4564"
    />
    <Path
      d="M9.24219 21.0079H10.5772C11.3148 21.0079 11.9128 20.4099 11.9128 19.6723V19.1719"
      stroke="#3C4564"
      strokeWidth="2.00337"
    />
  </Svg>
);
