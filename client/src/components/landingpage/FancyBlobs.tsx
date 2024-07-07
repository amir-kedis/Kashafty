import "./../../assets/styles/components/FancyBlobs.scss";

export default function FancyBlobs() {
  return (
    <div className="FancyBlobs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="360"
        height="882"
        viewBox="0 0 360 882"
        fill="none"
        className="Blob-1"
      >
        <g filter="url(#filter0_f_71_1543)">
          <path
            d="M28.9326 444.67C60.0433 380.541 123.206 346.94 204.633 328.13C304.305 305.105 556.184 268.938 604.43 352.549C637.644 410.111 556.454 449.215 489.196 458.174C301.06 483.234 184.43 595.077 93.8789 580.368C29.6292 569.931 -1.13528 506.649 28.9326 444.67Z"
            fill="url(#paint0_linear_71_1543)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_71_1543"
            x="-282.665"
            y="0.232281"
            width="1194.78"
            height="881.463"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="150"
              result="effect1_foregroundBlur_71_1543"
            />
          </filter>
          <linearGradient
            id="paint0_linear_71_1543"
            x1="68.8451"
            y1="481.485"
            x2="478.203"
            y2="477.608"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.422952" stopColor="#8900c9" />
            <stop offset="1" stopColor="#FFCCFF" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="360"
        height="684"
        viewBox="0 0 360 684"
        fill="none"
        className="Blob-2"
      >
        <g filter="url(#filter0_f_71_1544)">
          <ellipse
            cx="180.615"
            cy="342.099"
            rx="93.6478"
            ry="91.6021"
            fill="#FF29A8"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_71_1544"
            x="-163.033"
            y="0.49646"
            width="687.296"
            height="683.204"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="125"
              result="effect1_foregroundBlur_71_1544"
            />
          </filter>
        </defs>
      </svg>
      <div className="Blob-3"></div>
      <div className="Blob-4"></div>
    </div>
  );
}
