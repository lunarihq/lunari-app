import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const LightFlowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FA3092',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <G clipPath="url(#clip0_570_4188)">
      <Path
        d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32Z"
        fill="#FFDBEC"
      />
      <Path
        d="M50 37.2289C50 47.1701 41.9412 55.2289 32 55.2289C22.0588 55.2289 14 47.1701 14 37.2289C14 24.0251 32 8 32 8C32 8 50 24.025 50 37.2289Z"
        fill={color}
      />
      <Path
        d="M29.796 51.4109C21.7355 49.8386 16.1333 41.8733 17.8728 33.7998C17.9408 33.5168 18.3552 33.5659 18.3451 33.8644C18.1038 37.3946 19.3083 40.964 21.6345 43.5668C23.8377 46.0677 27.0137 47.6256 30.2964 47.7937C31.3066 47.8498 32.0799 48.7141 32.0239 49.7243C31.9724 50.8424 30.8848 51.6625 29.796 51.4109Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_570_4188">
        <Rect width="64" height="64" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
