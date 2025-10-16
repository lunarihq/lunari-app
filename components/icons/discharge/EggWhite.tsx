import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const EggWhiteIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9268E8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 62 62" fill="none">
    <Path
      d="M62 31C62 48.1208 48.1208 62 31 62C13.8792 62 0 48.1208 0 31C0 13.8792 13.8792 0 31 0C48.1208 0 62 13.8792 62 31Z"
      fill="#DED2FA"
    />
    <Path
      d="M30.1992 13.5055C30.6483 13 31.3516 13 31.8008 13.5055C33.9019 15.8714 36.8726 19.5089 39.3047 23.5875C41.7715 27.7245 43.5 32.0141 43.5 35.7535C43.4999 43.6979 37.688 49.7291 31 49.7291C24.312 49.7291 18.5001 43.6979 18.5 35.7535C18.5 32.0141 20.2285 27.7245 22.6953 23.5875C25.1274 19.5089 28.0981 15.8714 30.1992 13.5055Z"
      stroke={color}
      strokeWidth="5"
    />
  </Svg>
);
