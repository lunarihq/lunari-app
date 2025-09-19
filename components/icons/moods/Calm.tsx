import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const CalmIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFE549',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z"
      fill={color}
    />
    <Path
      d="M16.9922 25.7188C18.233 20.4466 27.227 19.6708 28.9328 25.7188Z"
      fill={color}
    />
    <Path
      d="M35.2891 25.7188C36.5299 20.4466 45.5238 19.6708 47.2296 25.7188Z"
      fill={color}
    />
    <Path
      d="M11.8008 33.7664C15.9666 51.47 46.1671 54.0737 51.895 33.7664Z"
      fill={color}
    />
    <Path
      d="M16.9922 25.7188C18.233 20.4466 27.227 19.6708 28.9328 25.7188M35.2891 25.7188C36.5299 20.4466 45.5238 19.6708 47.2296 25.7188M11.8008 33.7664C15.9666 51.47 46.1671 54.0737 51.895 33.7664"
      stroke="black"
      strokeWidth="2.46152"
      strokeMiterlimit="10"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);
