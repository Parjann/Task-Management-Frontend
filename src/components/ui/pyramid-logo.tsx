import React from 'react';

interface PyramidLogoProps {
  className?: string;
  size?: number;
}

export function PyramidLogo({ className = 'w-8 h-8', size }: PyramidLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="512" height="512" rx="128" fill="#000000" />
      <path
        d="M 256 112 L 132 296 L 196 392 L 376 336 L 256 112 M 256 112 L 196 392"
        stroke="#FFFFFF"
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
