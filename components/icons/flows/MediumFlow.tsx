import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const MediumFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="32" fill="#FFDBEC" />
    <Path
      d="M46.951 36.7534C46.951 45.8526 39.5748 53.2289 30.4755 53.2289C21.3763 53.2289 14 45.8526 14 36.7534C14 26.7429 25.3036 14.9607 29.1852 11.2099C29.9151 10.5046 31.0359 10.5046 31.7658 11.2099C35.6474 14.9607 46.951 26.7429 46.951 36.7534Z"
      fill={color}
    />
    <Path
      d="M41.6191 20.3525C42.6619 19.2301 44.3381 19.2301 45.3809 20.3525C47.1911 22.3012 49.4416 24.9736 51.2295 27.8809C53.0406 30.826 54.25 33.809 54.25 36.4229C54.25 42.4127 49.427 47.25 43.5 47.25C37.573 47.25 32.75 42.4127 32.75 36.4229C32.75 33.8091 33.9594 30.826 35.7705 27.8809C37.5584 24.9736 39.8089 22.3012 41.6191 20.3525Z"
      fill={color}
      stroke="#FFDBEC"
      strokeWidth="3.5"
    />
  </Svg>
);
