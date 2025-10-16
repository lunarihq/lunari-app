import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const HeadacheIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#6B3825',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="32" fill="#C7D3FF" />
    <Mask
      id="mask0_702_11098"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="64"
      height="64"
    >
      <Circle cx="32" cy="32" r="32" fill="#C7D3FF" />
    </Mask>
    <G mask="url(#mask0_702_11098)">
      <Path
        d="M13.8997 56.5H31.4661H50.7912C53.4258 56.5 55.6346 54.4765 55.8967 51.8549C56.1552 49.2701 56.1025 46.6408 55.7351 44.0692C55.5343 42.6637 55.1242 41.2955 54.5043 40.0182C53.0972 37.1189 52.0085 34.8393 52.0085 32.2486V25.3273C52.0085 23.4801 51.8581 21.6157 51.2425 19.874C47.348 8.85598 36.5018 6 31.4661 6C20.7064 6 15.0467 14.1044 12.8705 19.8937C12.2205 21.6228 12.065 23.4801 12.065 25.3273V32.2486C12.065 34.34 11.2913 36.5254 10.3696 38.3491C9.11243 40.8361 7.94663 43.437 7.71521 46.2141L7.64545 47.0512C7.54863 48.213 7.54326 49.3806 7.62938 50.5433L7.64002 50.6869C7.88281 53.9646 10.613 56.5 13.8997 56.5Z"
        fill="url(#paint0_linear_702_11098)"
      />
      <Path
        d="M47.195 56.4998H38.8984H15.1134C14.2854 54.9142 14.1579 53.3123 14.3173 51.9902C14.5351 50.1832 16.0438 48.8232 16.5809 47.0841C16.7637 46.4924 16.8675 45.8753 16.9322 45.29C17.0504 44.2223 16.7951 43.1559 16.5027 42.1222C15.3208 37.943 16.3452 33.4857 16.9192 31.963L45.4503 31.6777C48.4562 36.1355 47.2164 41.9374 45.758 45.2751C45.3068 46.3076 44.905 47.3836 44.9119 48.5104C44.9371 52.6209 46.3818 55.493 47.195 56.4998Z"
        fill="#3C273A"
      />
      <Path d="M23.5 48H38.5V61H23.5V48Z" fill="#B97B67" />
      <Path
        d="M17.1908 31.7956C21.898 28.9072 28.0153 22.5104 30.9671 19.1294C31.2179 18.842 31.6728 18.8711 31.8961 19.1804C35.0692 23.5761 42.2232 29.2506 45.5114 31.7931C45.6513 31.9013 45.7305 32.0659 45.7305 32.2428V36.4078C45.7305 39.6826 45.2003 43.0692 43.0832 45.5677C39.183 50.1704 33.8885 51.5731 31.4649 51.6488C26.6597 51.5032 22.7601 48.7178 20.1219 45.8557C17.6609 43.1859 16.9141 39.4834 16.9141 35.8523V32.288C16.9141 32.0862 17.0188 31.9012 17.1908 31.7956Z"
        fill="#DEA392"
      />
      <Path
        d="M33.75 29.9646C34.701 29.1086 38.6003 28.2533 40.8828 29.9646"
        stroke="#BE796A"
        strokeWidth="1.71186"
        strokeLinecap="round"
      />
      <Path
        d="M30.895 40.5202V33.5626C30.895 31.7787 30.2743 29.953 28.5526 29.4859C26.9891 29.0617 24.9149 29.0122 22.9062 29.6812"
        stroke="#BE796A"
        strokeWidth="1.71186"
        strokeLinecap="round"
      />
      <Path
        d="M20.9062 33.1035C22.6181 34.2448 25.1859 35.1007 27.7537 33.1035"
        stroke="#532A32"
        strokeWidth="1.42655"
        strokeLinecap="round"
      />
      <Path
        d="M34.0312 33.1035C35.7431 34.2448 38.3109 35.1007 40.8787 33.1035"
        stroke="#532A32"
        strokeWidth="1.42655"
        strokeLinecap="round"
      />
      <Path
        d="M38.4808 51.9661L54.4098 56.1251L50.4311 67.2249L12.5008 67.2249L8.49734 56.1249L23.4808 51.9661C22.904 59.1778 31.0317 59.3272 31.0317 59.3272C31.0317 59.3272 39.1293 59.1731 38.4808 51.9661Z"
        fill="#E9EEFF"
      />
      <G opacity="0.8">
        <Path
          opacity="0.5"
          d="M41.9957 22.1095C45.9221 22.1095 49.1051 18.9265 49.1051 15C49.1051 11.0736 45.9221 7.89062 41.9957 7.89062C38.0693 7.89062 34.8863 11.0736 34.8863 15C34.8863 18.9265 38.0693 22.1095 41.9957 22.1095Z"
          fill="url(#paint1_radial_702_11098)"
        />
        <Path
          opacity="0.7"
          d="M52 14.9996C52 20.5217 47.5219 24.9994 41.9998 24.9994C36.4777 24.9994 32 20.5217 32 14.9996C32 9.47749 36.4779 4.9998 41.9998 4.9998C47.5219 4.9998 52 9.47749 52 14.9996Z"
          fill="url(#paint2_radial_702_11098)"
        />
        <Path
          opacity="0.5"
          d="M41.9994 19.4671C44.4656 19.4671 46.4649 17.4678 46.4649 15.0015C46.4649 12.5353 44.4656 10.536 41.9994 10.536C39.5331 10.536 37.5338 12.5353 37.5338 15.0015C37.5338 17.4678 39.5331 19.4671 41.9994 19.4671Z"
          fill="url(#paint3_radial_702_11098)"
        />
        <Path
          opacity="0.9"
          d="M46.9709 15.001C46.9709 17.747 44.7446 19.9738 41.9982 19.9738C39.2526 19.9738 37.026 17.747 37.026 15.001C37.026 12.2546 39.2526 10.0282 41.9982 10.0282C44.7446 10.0282 46.9709 12.2546 46.9709 15.001Z"
          fill="url(#paint4_radial_702_11098)"
        />
      </G>
      <Path
        d="M33.5113 43.2677C32.6071 42.6992 30.992 42.6992 30.992 42.6992C30.992 42.6992 29.3762 42.6992 28.4721 43.2677C27.5686 43.8361 27.0656 45.0907 27.9979 45.5098C29.1338 46.0208 29.5933 45.3122 30.992 45.3122C32.3887 45.3122 32.8523 46.0306 33.9848 45.5098C34.9564 45.0613 34.4141 43.8361 33.5113 43.2677Z"
        fill="#AB6E5B"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_702_11098"
        x1="31.8941"
        y1="6"
        x2="31.8941"
        y2="56.5"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3E253A" />
        <Stop offset="1" stopColor="#593D56" />
      </LinearGradient>
      <RadialGradient
        id="paint1_radial_702_11098"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(41.9956 15) scale(7.10944)"
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
        id="paint2_radial_702_11098"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(41.9999 14.9996) scale(9.99996)"
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
        id="paint3_radial_702_11098"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(41.9993 15.0015) scale(4.46546 4.46545)"
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
        id="paint4_radial_702_11098"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(41.9984 15.001) scale(4.97266 4.97266)"
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
