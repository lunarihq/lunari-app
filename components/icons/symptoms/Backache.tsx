import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Mask,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const BackacheIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="32" fill="#C7D3FF" />
    <Mask
      id="mask0_702_11087"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="64"
      height="64"
    >
      <Circle cx="32" cy="32" r="32" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_702_11087)">
      <Path
        d="M54.2663 17.8417L54.5 11.9994V-3.00056H9.5V11.9994V23.4994C9.5 26.3551 7.12144 31.1647 5.09344 35.0169C3.71488 37.6356 3 40.5401 3 43.4994H60.5C60.5 40.5401 59.8016 37.6258 58.5084 34.9639C57.7662 33.4361 57.0814 31.9941 56.478 30.6771C54.6383 26.6616 54.0898 22.255 54.2663 17.8417Z"
        fill="#DEA392"
      />
      <Path
        opacity="0.8"
        d="M31.9 -14.7815C31.731 -13.4018 31.5351 -12.0164 31.4499 -10.6309C31.2189 -6.93258 31.3639 -3.21074 31.3987 0.494968C31.4584 7.32903 31.4887 10.155 31.9179 16.9886C32.8989 17.525 33.3169 17.5592 33.2925 15.0378C33.4653 13.1907 33.2751 11.313 33.4969 9.47089C33.6417 6.8088 33.7839 4.14739 33.9126 1.48588C34.0805 -2.03579 34.2848 -5.56119 34.3526 -9.08497C34.4135 -12.2184 34.4958 -12.3486 34.0893 -14.9052C33.09 -14.9419 31.9147 -15.181 31.9 -14.7815Z"
        fill="#CE8E7C"
      />
      <Path
        d="M3 42.9995H60.5V63.9995H3V42.9995Z"
        fill="#5473E4"
      />
      <G opacity="0.7">
        <Path
          opacity="0.5"
          d="M32.4952 36.3869C37.4032 36.3869 41.382 32.4081 41.382 27.5001C41.382 22.592 37.4032 18.6133 32.4952 18.6133C27.5872 18.6133 23.6084 22.592 23.6084 27.5001C23.6084 32.4081 27.5872 36.3869 32.4952 36.3869Z"
          fill="url(#paint0_radial_702_11087)"
        />
        <Path
          opacity="0.7"
          d="M45 27.4995C45 34.4022 39.4024 39.9993 32.4998 39.9993C25.5971 39.9993 20 34.4022 20 27.4995C20 20.5969 25.5974 14.9998 32.4998 14.9998C39.4024 14.9998 45 20.5969 45 27.4995Z"
          fill="url(#paint1_radial_702_11087)"
        />
        <Path
          opacity="0.5"
          d="M32.5009 33.0828C35.5837 33.0828 38.0828 30.5837 38.0828 27.5009C38.0828 24.4181 35.5837 21.919 32.5009 21.919C29.4181 21.919 26.9189 24.4181 26.9189 27.5009C26.9189 30.5837 29.4181 33.0828 32.5009 33.0828Z"
          fill="url(#paint2_radial_702_11087)"
        />
        <Path
          opacity="0.9"
          d="M38.7153 27.5002C38.7153 30.9327 35.9324 33.7161 32.4994 33.7161C29.0674 33.7161 26.2842 30.9327 26.2842 27.5002C26.2842 24.0671 29.0674 21.2842 32.4994 21.2842C35.9324 21.2842 38.7153 24.0671 38.7153 27.5002Z"
          fill="url(#paint3_radial_702_11087)"
        />
      </G>
    </G>
    <Defs>
      <RadialGradient
        id="paint0_radial_702_11087"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32.4951 27.5001) scale(8.88681)"
      >
        <Stop offset="0.6953" stopColor="white" />
        <Stop offset="0.7173" stopColor="#FBCAB5" />
        <Stop offset="0.7401" stopColor="#F79D7F" />
        <Stop offset="0.7622" stopColor="#F47A5A" />
        <Stop offset="0.7831" stopColor="#F15B3F" />
        <Stop offset="0.8023" stopColor="#EF402E" />
        <Stop offset="0.8194" stopColor="#EE2B26" />
        <Stop offset="0.8325" stopColor="#ED2224" />
        <Stop offset="0.8462" stopColor="#EE2D26" />
        <Stop offset="0.866" stopColor="#EF4430" />
        <Stop offset="0.8894" stopColor="#F26245" />
        <Stop offset="0.9157" stopColor="#F58565" />
        <Stop offset="0.9443" stopColor="#F9AE94" />
        <Stop offset="0.9745" stopColor="#FEE3D7" />
        <Stop offset="0.9869" stopColor="white" />
      </RadialGradient>
      <RadialGradient
        id="paint1_radial_702_11087"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32.4999 27.4995) scale(12.5 12.5)"
      >
        <Stop offset="0.6953" stopColor="white" />
        <Stop offset="0.7173" stopColor="#FBCAB5" />
        <Stop offset="0.7401" stopColor="#F79D7F" />
        <Stop offset="0.7622" stopColor="#F47A5A" />
        <Stop offset="0.7831" stopColor="#F15B3F" />
        <Stop offset="0.8023" stopColor="#EF402E" />
        <Stop offset="0.8194" stopColor="#EE2B26" />
        <Stop offset="0.8325" stopColor="#ED2224" />
        <Stop offset="0.8462" stopColor="#EE2D26" />
        <Stop offset="0.866" stopColor="#EF4430" />
        <Stop offset="0.8894" stopColor="#F26245" />
        <Stop offset="0.9157" stopColor="#F58565" />
        <Stop offset="0.9443" stopColor="#F9AE94" />
        <Stop offset="0.9745" stopColor="#FEE3D7" />
        <Stop offset="0.9869" stopColor="white" />
      </RadialGradient>
      <RadialGradient
        id="paint2_radial_702_11087"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32.5007 27.5009) scale(5.58183 5.58183)"
      >
        <Stop offset="0.6953" stopColor="white" />
        <Stop offset="0.7173" stopColor="#FBCAB5" />
        <Stop offset="0.7401" stopColor="#F79D7F" />
        <Stop offset="0.7622" stopColor="#F47A5A" />
        <Stop offset="0.7831" stopColor="#F15B3F" />
        <Stop offset="0.8023" stopColor="#EF402E" />
        <Stop offset="0.8194" stopColor="#EE2B26" />
        <Stop offset="0.8325" stopColor="#ED2224" />
        <Stop offset="0.8462" stopColor="#EE2D26" />
        <Stop offset="0.866" stopColor="#EF4430" />
        <Stop offset="0.8894" stopColor="#F26245" />
        <Stop offset="0.9157" stopColor="#F58565" />
        <Stop offset="0.9443" stopColor="#F9AE94" />
        <Stop offset="0.9745" stopColor="#FEE3D7" />
        <Stop offset="0.9869" stopColor="white" />
      </RadialGradient>
      <RadialGradient
        id="paint3_radial_702_11087"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32.4996 27.5002) scale(6.21584 6.21584)"
      >
        <Stop offset="0.2775" stopColor="#ED2224" />
        <Stop offset="0.3403" stopColor="#EE2D26" />
        <Stop offset="0.4311" stopColor="#EF4430" />
        <Stop offset="0.5388" stopColor="#F26245" />
        <Stop offset="0.6595" stopColor="#F58565" />
        <Stop offset="0.7911" stopColor="#F9AE94" />
        <Stop offset="0.9296" stopColor="#FEE3D7" />
        <Stop offset="0.9869" stopColor="white" />
      </RadialGradient>
    </Defs>
  </Svg>
);
