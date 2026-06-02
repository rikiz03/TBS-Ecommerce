import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
}

export default function LogoIcon({
  size = 40,
  strokeColor = "currentColor",
  fillColor = "#0E5B3D", // Matches the default header/footer green background
  ...props
}: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Shopping Bag Handle */}
      <path
        d="M75 65C75 40 125 40 125 65"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Handle Connectors / Loops */}
      <path
        d="M72 60V70 M128 60V70"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Shopping Bag Body */}
      <path
        d="M55 70H145L155 170C155 175 151 179 146 179H54C49 179 45 175 45 170L55 70Z"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinejoin="round"
        fill={fillColor}
      />

      {/* Silhouettes of Three Brothers (overlapping) */}
      
      {/* Left Brother Silhouette */}
      <g>
        {/* Shoulders */}
        <path
          d="M62 145C62 135 68 128 78 128C88 128 94 135 94 145"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="round"
          fill={fillColor}
        />
        {/* Head */}
        <circle cx="78" cy="115" r="11" stroke={strokeColor} strokeWidth="5" fill={fillColor} />
      </g>

      {/* Right Brother Silhouette */}
      <g>
        {/* Shoulders */}
        <path
          d="M106 145C106 135 112 128 122 128C132 128 138 135 138 145"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="round"
          fill={fillColor}
        />
        {/* Head */}
        <circle cx="122" cy="115" r="11" stroke={strokeColor} strokeWidth="5" fill={fillColor} />
      </g>

      {/* Center Brother Silhouette (Foreground, covers parts of left/right) */}
      <g>
        {/* Shoulders */}
        <path
          d="M80 138C80 125 88 119 100 119C112 119 120 125 120 138"
          stroke={strokeColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill={fillColor}
        />
        {/* Head */}
        <circle cx="100" cy="105" r="13" stroke={strokeColor} strokeWidth="5.5" fill={fillColor} />
      </g>
    </svg>
  );
}
