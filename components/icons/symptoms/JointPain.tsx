import React from 'react';
import Svg, {
  Ellipse,
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const JointPainIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#E34D4E',
}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Ellipse cx="32" cy="31.8075" rx="32" ry="31.8075" fill="#C7D3FF" />
    <Path
      d="M15.3268 13.0239C17.9704 13.369 28.2078 15.9434 32.3301 17.2316C36.4519 18.5197 43.3543 21.4181 44.0631 21.8367C44.7714 22.2553 46.6071 23.8655 47.3801 24.3806C48.1531 24.8958 49.6668 25.5398 50.6329 26.828C51.599 28.1162 51.0191 31.5297 51.0515 31.9159C51.0839 32.3021 51.6314 34.2667 51.6314 35.8769C51.6314 37.4871 51.3804 39.4754 51.3374 40.117C51.2944 40.7586 51.3523 47.4592 50.7942 52.8267C50.2361 58.1943 34.2798 54.6512 34.22 53.1699C34.0051 47.8454 35.9803 40.6533 36.8393 38.936C37.4579 37.6995 26.1908 36.8536 24.5594 36.7677C22.928 36.6817 13.653 35.0503 9.66021 32.7742C5.66554 30.4994 9.40109 12.2508 15.3268 13.0239Z"
      fill="#DEA392"
    />
    <Path
      d="M34.8598 51.7882C34.6449 46.4636 36.6201 39.2716 37.4791 37.5542C38.0976 36.3178 26.8306 35.4719 25.1992 35.3859C23.5672 35.3 14.2922 33.6686 10.2994 31.3925C7.78596 29.9604 8.33536 22.2016 10.5641 16.8396C7.81773 22.1374 6.92013 31.2131 9.65903 32.7741C13.6525 35.0495 22.9269 36.6815 24.5582 36.7675C26.1896 36.8535 37.4567 37.6994 36.8381 38.9358C35.9792 40.6532 34.0046 47.8452 34.2188 53.1698C34.44 52.7537 34.9127 53.115 34.8598 51.7882Z"
      fill="#BE796A"
    />
    <Path
      d="M31.8568 36.2663C35.9991 36.26 38.9417 36.2663 36.7752 38.6539C36.3797 38.3399 33.6738 37.7021 32.357 37.5301C31.0401 37.3582 22.3893 36.6375 20.5529 36.1411C27.005 36.2663 27.6889 36.2725 31.8568 36.2663Z"
      fill="#B97B67"
    />
    <Path
      d="M26.2191 19.9857C27.9862 20.775 41.7181 25.0176 42.5285 25.0076C43.3395 24.9976 45.5421 24.5385 46.2921 25.5757C47.0421 26.6128 47.9584 29.1231 47.3897 30.2157C46.8209 31.3082 44.7965 33.6529 42.9739 32.4793C41.1513 31.3058 41.8626 30.22 41.0417 29.419C40.2207 28.6186 29.6706 24.1835 27.0699 23.5375C24.4693 22.8922 26.2191 19.9857 26.2191 19.9857Z"
      fill="#F2E8DF"
    />
    <Path
      d="M47.7028 29.1001C48.0522 28.9737 49.0009 29.0871 49.0856 29.4047C49.1703 29.7224 48.943 31.431 48.6421 31.692C48.3419 31.953 47.5682 31.7425 47.732 31.2355C47.9762 30.4824 47.7028 29.1001 47.7028 29.1001Z"
      fill="#F2E8DF"
    />
    <Path
      d="M41.37 33.492C41.722 32.9905 44.4827 34.3354 46.1577 33.4702C47.8327 32.6049 49.3843 36.5616 49.2579 37.5221C49.1314 38.4827 48.3895 52.0725 48.7988 53.3657C49.208 54.6588 46.2928 56.2877 45.6768 55.2867C45.0614 54.2863 43.9956 41.2564 44.2634 39.9882C44.5313 38.72 42.1175 37.4879 41.6896 37.5097C41.2617 37.5315 40.4569 34.7944 41.37 33.492Z"
      fill="#F2E8DF"
    />
    <Path
      d="M43.1647 35.446C43.473 35.4341 44.8459 35.2292 45.2059 36.4146C45.566 37.6 44.6572 38.4764 44.4603 39.2326C44.2635 39.9882 45.7771 54.3972 45.6762 55.2873C45.5753 56.1768 44.0629 56.013 43.9084 55.694C43.7539 55.3751 43.3908 47.3814 43.3123 45.7743C43.2338 44.1672 43.3192 39.1902 43.0445 38.5723C42.7698 37.955 40.8182 35.5338 43.1647 35.446Z"
      fill="#BE796A"
    />
    <G opacity="0.9">
      <Path
        opacity="0.5"
        d="M46.4963 37.254C50.2264 37.254 53.2503 34.2301 53.2503 30.5C53.2503 26.7699 50.2264 23.7461 46.4963 23.7461C42.7662 23.7461 39.7424 26.7699 39.7424 30.5C39.7424 34.2301 42.7662 37.254 46.4963 37.254Z"
        fill="url(#paint0_radial_702_10104)"
      />
      <Path
        opacity="0.7"
        d="M56 30.4996C56 35.7456 51.7458 39.9994 46.4998 39.9994C41.2538 39.9994 37 35.7456 37 30.4996C37 25.2536 41.254 20.9998 46.4998 20.9998C51.7458 20.9998 56 25.2536 56 30.4996Z"
        fill="url(#paint1_radial_702_10104)"
      />
      <Path
        opacity="0.5"
        d="M46.5006 34.7429C48.8436 34.7429 50.7429 32.8435 50.7429 30.5006C50.7429 28.1577 48.8436 26.2584 46.5006 26.2584C44.1577 26.2584 42.2584 28.1577 42.2584 30.5006C42.2584 32.8435 44.1577 34.7429 46.5006 34.7429Z"
        fill="url(#paint2_radial_702_10104)"
      />
      <Path
        opacity="0.9"
        d="M51.2236 30.5001C51.2236 33.1088 49.1086 35.2242 46.4995 35.2242C43.8912 35.2242 41.776 33.1088 41.776 30.5001C41.776 27.891 43.8912 25.776 46.4995 25.776C49.1086 25.776 51.2236 27.891 51.2236 30.5001Z"
        fill="url(#paint3_radial_702_10104)"
      />
    </G>
    <Defs>
      <RadialGradient
        id="paint0_radial_702_10104"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(46.4963 30.5) scale(6.75397)"
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
        id="paint1_radial_702_10104"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(46.4999 30.4996) scale(9.49996)"
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
        id="paint2_radial_702_10104"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(46.5006 30.5006) scale(4.24218 4.24218)"
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
        id="paint3_radial_702_10104"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(46.4997 30.5001) scale(4.72403 4.72403)"
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
