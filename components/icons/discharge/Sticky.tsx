import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const StickyIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 62 62" fill="none">
    <Path
      d="M62 31C62 48.1208 48.1208 62 31 62C13.8792 62 0 48.1208 0 31C0 13.8792 13.8792 0 31 0C48.1208 0 62 13.8792 62 31Z"
      fill="#DED2FA"
    />
    <Path
      d="M47.8204 12.3884C47.7573 11.8954 47.0088 11.7192 46.7224 12.1254C45.1347 14.3767 41.2813 18.3331 34.51 16.7705C21.3412 13.7314 7.3488 25.9629 13.7894 40.9904C21.1546 58.1758 53.3861 55.8797 47.8204 12.3884Z"
      fill={color}
    />
    <Path
      d="M33.785 20.6008C34.3575 19.9305 34.026 18.8903 33.1698 18.6798C30.9459 18.1342 26.4644 17.4932 23.6459 20.1776C20.2111 23.4487 30.7915 24.1059 33.785 20.6008Z"
      fill="#B18BFE"
    />
  </Svg>
);
