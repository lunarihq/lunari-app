import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const SpottingIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#9063E2',
}) => (
  <Svg width={size} height={size} viewBox="0 0 62 62" fill="none">
    <Path
      d="M62 31C62 48.1208 48.1208 62 31 62C13.8792 62 0 48.1208 0 31C0 13.8792 13.8792 0 31 0C48.1208 0 62 13.8792 62 31Z"
      fill="#DED2FA"
    />
    <Path
      d="M35.2236 38.5784C27.6291 49.1379 40.9227 51.1448 42.572 43.2016C43.6823 37.8517 40.0294 31.8963 35.2236 38.5784Z"
      fill={color}
    />
    <Path
      d="M21.3212 17.1175C9.21607 29.295 25.9543 42.9147 30.0991 32.0128C32.8906 24.6698 28.9815 9.41167 21.3212 17.1175Z"
      fill={color}
    />
    <Path
      d="M35.8264 23.2977C31.9994 32.7499 43.5346 32.2219 41.8565 25.7389C40.7264 21.3723 36.362 16.7188 35.8264 23.2977Z"
      fill={color}
    />
  </Svg>
);
