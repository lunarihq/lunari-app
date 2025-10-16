import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const LightFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32Z"
      fill="#FFDBEC"
    />
    <Path
      d="M48.951 36.7534C48.951 45.8526 41.5748 53.2289 32.4755 53.2289C23.3763 53.2289 16 45.8526 16 36.7534C16 26.7429 27.3036 14.9607 31.1852 11.2099C31.9151 10.5046 33.0359 10.5046 33.7658 11.2099C37.6474 14.9607 48.951 26.7429 48.951 36.7534Z"
      fill={color}
    />
  </Svg>
);
