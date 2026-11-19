import React from 'react';

export const VenezuelanFlagMark: React.FC<{ className?: string }> = ({
  className = 'w-10 h-7',
}) => (
  <svg viewBox="0 0 90 60" className={className} aria-hidden="true">
    <rect width="90" height="20" fill="#FFCC00" />
    <rect y="20" width="90" height="20" fill="#00247D" />
    <rect y="40" width="90" height="20" fill="#CF142B" />
    <g fill="#FFFFFF">
      <circle cx="24" cy="33" r="1.7" />
      <circle cx="30" cy="29" r="1.7" />
      <circle cx="37" cy="26.5" r="1.7" />
      <circle cx="42" cy="25.5" r="1.7" />
      <circle cx="48" cy="25.5" r="1.7" />
      <circle cx="53" cy="26.5" r="1.7" />
      <circle cx="60" cy="29" r="1.7" />
      <circle cx="66" cy="33" r="1.7" />
    </g>
  </svg>
);

export const LsvLogoBadge: React.FC<{ className?: string }> = ({
  className = 'h-9 w-9',
}) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="lsvBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A1628" />
        <stop offset="100%" stopColor="#16325C" />
      </linearGradient>
      <linearGradient id="lsvBadgeTri" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFCC00" />
        <stop offset="50%" stopColor="#1D63DC" />
        <stop offset="100%" stopColor="#E53E3E" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#lsvBadgeBg)" />
    <rect
      x="4"
      y="4"
      width="56"
      height="56"
      rx="11"
      fill="none"
      stroke="url(#lsvBadgeTri)"
      strokeWidth="2.5"
    />
    <text
      x="32"
      y="37"
      textAnchor="middle"
      fontFamily="Playfair Display, Georgia, serif"
      fontWeight="900"
      fontSize="20"
      fill="#FFFFFF"
    >
      LSV
    </text>
    <rect x="13" y="45" width="12.6" height="4" rx="1" fill="#FFCC00" />
    <rect x="25.6" y="45" width="12.6" height="4" rx="1" fill="#1D63DC" />
    <rect x="38.2" y="45" width="12.6" height="4" rx="1" fill="#CF142B" />
  </svg>
);
