import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Mask,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const TenderBreastsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
}) => (
  <Svg width={size} height={size} viewBox="0 0 65 64" fill="none">
    <Circle cx="32.9164" cy="32.0008" r="32" fill="#C7D3FF" />
    <Mask
      id="mask0_702_11090"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="65"
      height="65"
    >
      <Circle cx="32.9164" cy="32.0008" r="32" fill="#C7D3FF" />
    </Mask>
    <G mask="url(#mask0_702_11090)">
      <Rect
        x="38.9165"
        y="3.75895"
        width="15"
        height="16.7273"
        transform="rotate(-35.7274 38.9165 3.75895)"
        fill="#DEA392"
      />
      <Rect x="2.91647" y="-2.01646" width="31" height="21" fill="#DEA392" />
      <Path
        d="M33.898 -0.0164642C27.418 18.9835 13.0001 16.3101 5.16333 16.3101H1.00006V65.6162H47.9388C45.849 54.906 46.1973 46.1332 46.6327 43.0856C61.5225 31.5917 54.796 18.4869 49.5715 13.3713C45.3919 9.45292 44.5647 4.77265 44.6735 2.92231V-0.0164642H33.898Z"
        fill="#5473E4"
      />
      <Path
        d="M14.9359 44.1276C13.6739 45.8643 7.80091 48.9339 0.948558 45.9727"
        stroke="#385BDA"
        strokeWidth="2.65306"
        strokeLinecap="round"
      />
      <Path
        d="M23.6938 43.837C27.7296 46.9662 39.1398 47.7148 45.2826 42.3395"
        stroke="#385BDA"
        strokeWidth="2.65306"
        strokeLinecap="round"
      />
      <G opacity="0.75">
        <Path
          opacity="0.5"
          d="M48.7359 41.629C54.1624 41.629 58.5613 37.23 58.5613 31.8036C58.5613 26.3772 54.1624 21.9782 48.7359 21.9782C43.3095 21.9782 38.9105 26.3772 38.9105 31.8036C38.9105 37.23 43.3095 41.629 48.7359 41.629Z"
          fill="url(#paint0_radial_702_11090)"
        />
        <Path
          opacity="0.7"
          d="M62.557 31.8035C62.557 39.4352 56.3681 45.6235 48.7365 45.6235C41.1048 45.6235 34.9165 39.4352 34.9165 31.8035C34.9165 24.1719 41.1051 17.9836 48.7365 17.9836C56.3681 17.9836 62.557 24.1719 62.557 31.8035Z"
          fill="url(#paint1_radial_702_11090)"
        />
        <Path
          opacity="0.5"
          d="M48.7359 37.975C52.1443 37.975 54.9074 35.212 54.9074 31.8036C54.9074 28.3952 52.1443 25.6321 48.7359 25.6321C45.3275 25.6321 42.5644 28.3952 42.5644 31.8036C42.5644 35.212 45.3275 37.975 48.7359 37.975Z"
          fill="url(#paint2_radial_702_11090)"
        />
        <Path
          opacity="0.9"
          d="M55.6087 31.8036C55.6087 35.5986 52.5318 38.6761 48.7362 38.6761C44.9417 38.6761 41.8646 35.5986 41.8646 31.8036C41.8646 28.0079 44.9417 24.9311 48.7362 24.9311C52.5318 24.9311 55.6087 28.0079 55.6087 31.8036Z"
          fill="url(#paint3_radial_702_11090)"
        />
      </G>
    </G>
    <Defs>
      <RadialGradient
        id="paint0_radial_702_11090"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48.7358 31.8036) scale(9.82544)"
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
        id="paint1_radial_702_11090"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48.7366 31.8035) scale(13.8202)"
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
        id="paint2_radial_702_11090"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48.7358 31.8036) scale(6.17138 6.17138)"
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
        id="paint3_radial_702_11090"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48.7365 31.8036) scale(6.87235 6.87235)"
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
