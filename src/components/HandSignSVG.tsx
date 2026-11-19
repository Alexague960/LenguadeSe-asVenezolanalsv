import React from 'react';

interface HandSignSVGProps {
  signId: string;
  letter: string;
  color?: string;
  className?: string;
}

type FingerPose = 'up' | 'folded' | 'hook' | 'spread-left' | 'spread-right' | 'bent-over-thumb';
type ThumbPose = 'side' | 'across' | 'tucked' | 'out' | 'up' | 'between' | 'circle';

interface HandConfig {
  mode:
    | 'upright'
    | 'profile-c'
    | 'profile-o'
    | 'horizontal-g'
    | 'horizontal-h'
    | 'down-p'
    | 'down-q'
    | 'crossed-r'
    | 'tucked-m'
    | 'tucked-n'
    | 'tucked-nh';
  index?: FingerPose;
  middle?: FingerPose;
  ring?: FingerPose;
  pinky?: FingerPose;
  thumb?: ThumbPose;
  motion?: 'j' | 'z' | 'tilde' | 'circle' | 'shake';
}

const HAND_CONFIGS: Record<string, HandConfig> = {
  'abc-a': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'side' },
  'abc-b': { mode: 'upright', index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'across' },
  'abc-c': { mode: 'profile-c' },
  'abc-d': { mode: 'upright', index: 'up', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'circle' },
  'abc-e': { mode: 'upright', index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'across' },
  'abc-f': { mode: 'upright', index: 'hook', middle: 'up', ring: 'up', pinky: 'up', thumb: 'circle' },
  'abc-g': { mode: 'horizontal-g' },
  'abc-h': { mode: 'horizontal-h' },
  'abc-i': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'up', thumb: 'across' },
  'abc-j': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'up', thumb: 'across', motion: 'j' },
  'abc-k': { mode: 'upright', index: 'up', middle: 'spread-right', ring: 'folded', pinky: 'folded', thumb: 'between' },
  'abc-l': { mode: 'upright', index: 'up', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'out' },
  'abc-m': { mode: 'tucked-m' },
  'abc-n': { mode: 'tucked-n' },
  'abc-nh': { mode: 'tucked-nh', motion: 'tilde' },
  'abc-o': { mode: 'profile-o' },
  'abc-p': { mode: 'down-p' },
  'abc-q': { mode: 'down-q' },
  'abc-r': { mode: 'crossed-r' },
  'abc-s': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'abc-t': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'between' },
  'abc-u': { mode: 'upright', index: 'up', middle: 'up', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'abc-v': { mode: 'upright', index: 'spread-left', middle: 'spread-right', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'abc-w': { mode: 'upright', index: 'spread-left', middle: 'up', ring: 'spread-right', pinky: 'folded', thumb: 'across' },
  'abc-x': { mode: 'upright', index: 'hook', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'abc-y': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'spread-right', thumb: 'out' },
  'abc-z': { mode: 'upright', index: 'up', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'across', motion: 'z' },

  'num-0': { mode: 'profile-o', motion: 'circle' },
  'num-1': { mode: 'upright', index: 'up', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'num-2': { mode: 'upright', index: 'spread-left', middle: 'spread-right', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'num-3': { mode: 'upright', index: 'up', middle: 'spread-right', ring: 'folded', pinky: 'folded', thumb: 'out' },
  'num-4': { mode: 'upright', index: 'spread-left', middle: 'up', ring: 'up', pinky: 'spread-right', thumb: 'across' },
  'num-5': { mode: 'upright', index: 'spread-left', middle: 'up', ring: 'up', pinky: 'spread-right', thumb: 'out' },
  'num-6': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'spread-right', thumb: 'out' },
  'num-7': { mode: 'upright', index: 'up', middle: 'spread-right', ring: 'folded', pinky: 'folded', thumb: 'out' },
  'num-8': { mode: 'upright', index: 'up', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'out' },
  'num-9': { mode: 'upright', index: 'hook', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'across' },
  'num-10': { mode: 'upright', index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'up', motion: 'shake' },
};

const STROKE = '#0A1628';
const SKIN = '#FFFDF9';
const SKIN_SHADE = '#F1EDE4';
const ACCENT_ACTIVE = '#F6E05E';

function FingerSegment({
  x,
  pose,
  length,
}: {
  x: number;
  pose: FingerPose;
  length: number;
}) {
  if (pose === 'up') {
    const topY = 66 - length;
    return (
      <g>
        <rect
          x={x - 5.2}
          y={topY}
          width={10.4}
          height={length + 4}
          rx={5.2}
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
        />
        <line x1={x - 2.6} y1={topY + 12} x2={x + 2.6} y2={topY + 12} stroke={STROKE} strokeWidth={1.2} strokeOpacity={0.35} strokeLinecap="round" />
        <line x1={x - 2.6} y1={topY + 23} x2={x + 2.6} y2={topY + 23} stroke={STROKE} strokeWidth={1.2} strokeOpacity={0.35} strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'spread-left' || pose === 'spread-right') {
    const angle = pose === 'spread-left' ? -13 : 13;
    const topY = 66 - length;
    return (
      <g transform={`rotate(${angle}, ${x}, 66)`}>
        <rect
          x={x - 5}
          y={topY}
          width={10}
          height={length + 4}
          rx={5}
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
        />
        <line x1={x - 2.4} y1={topY + 12} x2={x + 2.4} y2={topY + 12} stroke={STROKE} strokeWidth={1.2} strokeOpacity={0.35} strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'hook') {
    return (
      <g>
        <path
          d={`M ${x - 5} 68 L ${x - 5} 45 C ${x - 5} 36, ${x + 8} 36, ${x + 8} 47 L ${x + 8} 54 C ${x + 8} 58, ${x + 2} 58, ${x + 1} 53 L ${x + 1} 47 C ${x + 1} 44, ${x - 1} 44, ${x - 1} 47 L ${x - 1} 68 Z`}
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  // folded
  return (
    <g>
      <rect
        x={x - 5.2}
        y={58}
        width={10.4}
        height={18}
        rx={5}
        fill={SKIN_SHADE}
        stroke={STROKE}
        strokeWidth={2.2}
      />
      <line x1={x - 2.5} y1={67} x2={x + 2.5} y2={67} stroke={STROKE} strokeWidth={1.2} strokeOpacity={0.3} strokeLinecap="round" />
    </g>
  );
}

function ThumbSegment({ pose }: { pose: ThumbPose }) {
  switch (pose) {
    case 'out':
      return (
        <path
          d="M 41 90 C 31 85, 21 78, 17 70 C 15 65, 20 61, 25 65 L 43 79 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    case 'up':
      return (
        <g>
          <rect
            x={26}
            y={34}
            width={11}
            height={36}
            rx={5.5}
            transform="rotate(-12, 32, 62)"
            fill={ACCENT_ACTIVE}
            fillOpacity={0.35}
            stroke={STROKE}
            strokeWidth={2.2}
          />
        </g>
      );
    case 'side':
      return (
        <path
          d="M 39 87 C 32 82, 30 68, 32 54 C 33 49, 40 49, 41 55 L 41 79 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    case 'between':
      return (
        <path
          d="M 38 92 C 42 84, 46 72, 48 60 C 49 55, 55 56, 55 62 C 54 73, 50 85, 45 93 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    case 'circle':
      return (
        <path
          d="M 39 92 C 45 86, 54 78, 57 70 C 59 65, 53 62, 49 66 L 37 83 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    case 'across':
    default:
      return (
        <path
          d="M 39 90 C 44 82, 57 76, 68 76 C 73 76, 73 84, 67 85 C 58 86, 49 91, 44 96 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
  }
}

function MotionOverlay({ motion }: { motion?: HandConfig['motion'] }) {
  if (!motion) return null;
  if (motion === 'j') {
    return (
      <g>
        <path
          d="M 88 38 L 88 64 C 88 76, 74 78, 70 69"
          fill="none"
          stroke="#C53030"
          strokeWidth={2.4}
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <polygon points="68,64 75,69 68,73" fill="#C53030" />
      </g>
    );
  }
  if (motion === 'z') {
    return (
      <g>
        <path
          d="M 74 22 L 96 22 L 74 44 L 96 44"
          fill="none"
          stroke="#C53030"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="100,44 92,40 92,48" fill="#C53030" />
      </g>
    );
  }
  if (motion === 'tilde') {
    return (
      <g>
        <path
          d="M 40 30 Q 48 22, 56 30 T 72 30"
          fill="none"
          stroke="#C53030"
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path
          d="M 36 42 L 26 42 M 76 42 L 86 42"
          stroke="#D69E2E"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (motion === 'circle') {
    return (
      <g>
        <path
          d="M 84 34 A 24 24 0 1 1 60 22"
          fill="none"
          stroke="#D69E2E"
          strokeWidth={2.2}
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <polygon points="56,22 64,18 64,26" fill="#D69E2E" />
      </g>
    );
  }
  if (motion === 'shake') {
    return (
      <g>
        <path d="M 22 44 Q 16 50, 22 56" fill="none" stroke="#C53030" strokeWidth={2.2} strokeLinecap="round" />
        <path d="M 44 44 Q 50 50, 44 56" fill="none" stroke="#C53030" strokeWidth={2.2} strokeLinecap="round" />
      </g>
    );
  }
  return null;
}

function renderHandConfig(config: HandConfig) {
  if (config.mode === 'profile-c') {
    return (
      <g>
        <rect x={54} y={92} width={22} height={22} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        <path
          d="M 74 96 C 84 88, 86 70, 82 54 C 77 35, 58 24, 41 29 C 31 32, 26 40, 29 45 C 32 49, 38 47, 45 43 C 56 38, 66 46, 67 60 C 68 72, 62 79, 51 80 C 42 81, 34 75, 30 78 C 26 81, 29 88, 38 92 C 48 96, 62 99, 74 96 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.3}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (config.mode === 'profile-o') {
    return (
      <g>
        <rect x={52} y={92} width={22} height={22} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        <path
          d="M 73 95 C 83 84, 83 56, 73 39 C 63 23, 40 24, 34 42 C 29 58, 33 78, 44 89 C 53 98, 64 100, 73 95 Z"
          fill={SKIN}
          stroke={STROKE}
          strokeWidth={2.3}
          strokeLinejoin="round"
        />
        <ellipse cx={53} cy={59} rx={9} ry={14} fill="#F8FAFC" stroke={STROKE} strokeWidth={2.2} />
        <MotionOverlay motion={config.motion} />
      </g>
    );
  }

  if (config.mode === 'horizontal-g' || config.mode === 'horizontal-h') {
    const isH = config.mode === 'horizontal-h';
    return (
      <g>
        {/* Wrist on right */}
        <rect x={82} y={54} width={22} height={26} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        {/* Palm */}
        <rect x={54} y={48} width={34} height={36} rx={12} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        {/* Index horizontal */}
        <rect x={18} y={48} width={44} height={10} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        {/* Second finger for H or thumb for G */}
        {isH ? (
          <rect x={21} y={59} width={41} height={10} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        ) : (
          <rect x={26} y={66} width={34} height={10} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        )}
        {/* Folded knuckles */}
        <rect x={56} y={71} width={16} height={10} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
      </g>
    );
  }

  if (config.mode === 'down-p' || config.mode === 'down-q') {
    const isP = config.mode === 'down-p';
    return (
      <g>
        <rect x={48} y={10} width={24} height={22} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        <rect x={42} y={26} width={36} height={34} rx={11} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        {isP ? (
          <>
            <rect x={43} y={54} width={10.5} height={42} rx={5.2} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
            <rect x={56} y={52} width={10.5} height={36} rx={5.2} transform="rotate(-18, 60, 56)" fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
            <rect x={63} y={44} width={9.5} height={16} rx={4.5} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
            <rect x={71} y={42} width={9.5} height={15} rx={4.5} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
          </>
        ) : (
          <>
            <rect x={44} y={54} width={10.5} height={42} rx={5.2} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
            <rect x={30} y={54} width={10} height={30} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
            <rect x={57} y={45} width={20} height={14} rx={5} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
          </>
        )}
      </g>
    );
  }

  if (config.mode === 'crossed-r') {
    return (
      <g>
        <rect x={48} y={90} width={24} height={24} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        <rect x={40} y={60} width={40} height={36} rx={12} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        <rect x={45} y={22} width={10} height={44} rx={5} transform="rotate(9, 50, 62)" fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        <rect x={54} y={24} width={10} height={43} rx={5} transform="rotate(-11, 59, 62)" fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        <FingerSegment x={65} pose="folded" length={30} />
        <FingerSegment x={75} pose="folded" length={24} />
        <ThumbSegment pose="across" />
      </g>
    );
  }

  if (config.mode === 'tucked-m' || config.mode === 'tucked-n' || config.mode === 'tucked-nh') {
    const count = config.mode === 'tucked-m' ? 3 : 2;
    return (
      <g>
        <rect x={48} y={90} width={24} height={24} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
        <rect x={40} y={58} width={40} height={38} rx={12} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        {/* Tucked thumb peeking under */}
        <path
          d="M 41 84 C 48 76, 61 73, 69 78 C 72 82, 65 89, 55 89 Z"
          fill={ACCENT_ACTIVE}
          fillOpacity={0.45}
          stroke={STROKE}
          strokeWidth={2.1}
        />
        {/* Folded fingers over thumb */}
        <rect x={41} y={54} width={10} height={28} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        <rect x={51} y={52} width={10} height={30} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        {count === 3 ? (
          <rect x={61} y={54} width={10} height={28} rx={5} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        ) : (
          <rect x={61} y={62} width={10} height={16} rx={4.5} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
        )}
        <rect x={71} y={64} width={9.5} height={15} rx={4.5} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2} />
        <MotionOverlay motion={config.motion} />
      </g>
    );
  }

  // Standard upright hand
  return (
    <g>
      <rect x={48} y={90} width={24} height={24} rx={4} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
      <rect x={40} y={60} width={40} height={36} rx={12} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
      <FingerSegment x={45} pose={config.index || 'folded'} length={38} />
      <FingerSegment x={55} pose={config.middle || 'folded'} length={42} />
      <FingerSegment x={65} pose={config.ring || 'folded'} length={37} />
      <FingerSegment x={75} pose={config.pinky || 'folded'} length={30} />
      <ThumbSegment pose={config.thumb || 'across'} />
      <MotionOverlay motion={config.motion} />
    </g>
  );
}

function renderContextualSign(signId: string, letter: string, color: string) {
  const accent = color || '#0A1628';

  // Colores: swatch + hand indicator
  if (signId.startsWith('col-')) {
    return (
      <g>
        <circle cx={60} cy={52} r={26} fill={accent} fillOpacity={0.14} stroke={accent} strokeWidth={2} />
        <circle cx={60} cy={52} r={14} fill={accent} stroke={STROKE} strokeWidth={2} />
        {/* Chin/lip indicator */}
        <path d="M 42 88 Q 60 98, 78 88" fill="none" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
        <path d="M 60 72 L 60 85" stroke={STROKE} strokeWidth={2} strokeDasharray="3 3" strokeLinecap="round" />
      </g>
    );
  }

  // Días de la semana: letter + circular motion ring
  if (signId.startsWith('dia-')) {
    const initial = letter.charAt(0).toUpperCase();
    return (
      <g>
        <circle cx={60} cy={60} r={34} fill="none" stroke="#D69E2E" strokeWidth={2.2} strokeDasharray="6 4" />
        <polygon points="88,40 96,46 86,50" fill="#D69E2E" />
        <circle cx={60} cy={60} r={22} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        <text
          x={60}
          y={68}
          textAnchor="middle"
          fontFamily="Playfair Display, serif"
          fontWeight="900"
          fontSize="24"
          fill={STROKE}
        >
          {initial}
        </text>
      </g>
    );
  }

  // Saludos, Familia, Vocabulario, Conciencia, Intro: crisp spatial + hand conceptual illustrations
  switch (signId) {
    case 'intro-identidad':
      return (
        <g>
          <circle cx={60} cy={58} r={30} fill="#1A365D" fillOpacity={0.08} stroke="#1A365D" strokeWidth={2} />
          <path d="M 46 66 L 46 46 C 46 42, 52 42, 52 46 L 52 60 M 52 42 C 52 38, 58 38, 58 42 L 58 60 M 58 44 C 58 40, 64 40, 64 44 L 64 62 M 64 48 C 64 44, 70 44, 70 48 L 70 68 C 70 76, 62 82, 54 82 C 47 82, 42 75, 42 66 L 42 58" fill={SKIN} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'intro-legal':
      return (
        <g>
          <rect x={34} y={32} width={52} height={56} rx={6} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
          <rect x={42} y={42} width={36} height={6} rx={1} fill="#FFCC00" />
          <rect x={42} y={48} width={36} height={6} rx={1} fill="#00247D" />
          <rect x={42} y={54} width={36} height={6} rx={1} fill="#CF142B" />
          <line x1={42} y1={70} x2={78} y2={70} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
          <line x1={42} y1={78} x2={68} y2={78} stroke={STROKE} strokeWidth={2} strokeOpacity={0.5} strokeLinecap="round" />
        </g>
      );
    case 'intro-visual':
      return (
        <g>
          <path d="M 24 58 Q 60 28, 96 58 Q 60 88, 24 58 Z" fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
          <circle cx={60} cy={58} r={12} fill="#2F855A" fillOpacity={0.2} stroke={STROKE} strokeWidth={2.2} />
          <circle cx={60} cy={58} r={5} fill={STROKE} />
        </g>
      );
    case 'intro-unica':
      return (
        <g>
          <circle cx={46} cy={58} r={20} fill="#805AD5" fillOpacity={0.12} stroke={STROKE} strokeWidth={2} />
          <circle cx={74} cy={58} r={20} fill="#D69E2E" fillOpacity={0.18} stroke={STROKE} strokeWidth={2} />
          <path d="M 60 44 L 60 72" stroke="#C53030" strokeWidth={2.2} strokeLinecap="round" />
        </g>
      );
    case 'sal-buenos-dias':
      return (
        <g>
          <path d="M 26 78 L 94 78" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M 38 78 A 22 22 0 0 1 82 78" fill="#F6E05E" stroke={STROKE} strokeWidth={2.2} />
          <path d="M 60 30 L 60 46 M 38 38 L 46 48 M 82 38 L 74 48" stroke="#D69E2E" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    case 'sal-buenas-tardes':
      return (
        <g>
          <path d="M 26 76 Q 60 32, 94 76" fill="none" stroke="#2F855A" strokeWidth={2.6} strokeDasharray="5 4" strokeLinecap="round" />
          <polygon points="94,76 85,72 90,65" fill="#2F855A" />
          <rect x={46} y={46} width={28} height={14} rx={7} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
        </g>
      );
    case 'sal-buenas-noches':
      return (
        <g>
          <path d="M 68 32 A 22 22 0 1 0 86 68 A 17 17 0 1 1 68 32 Z" fill="#0A1628" fillOpacity={0.15} stroke={STROKE} strokeWidth={2.2} />
          <path d="M 36 40 L 36 78" stroke="#2F855A" strokeWidth={2.4} strokeLinecap="round" />
          <polygon points="36,84 31,75 41,75" fill="#2F855A" />
        </g>
      );
    case 'sal-hola':
    case 'fam-papa':
    case 'fam-abuelo':
      return (
        <g>
          <circle cx={50} cy={62} r={22} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
          <path d="M 64 42 L 86 30 L 92 40 L 70 52 Z" fill={SKIN} stroke={STROKE} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M 74 24 L 90 24" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
          <polygon points="94,24 87,20 87,28" fill={accent} />
        </g>
      );
    case 'sal-gracias':
    case 'fam-mama':
    case 'fam-abuela':
      return (
        <g>
          <circle cx={46} cy={52} r={20} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
          <path d="M 52 72 L 84 72 C 89 72, 89 82, 84 82 L 52 82 Z" fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
          <path d="M 58 89 L 86 89" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
          <polygon points="91,89 83,85 83,93" fill={accent} />
        </g>
      );
    case 'sal-por-favor':
    case 'sal-lo-siento':
      return (
        <g>
          <path d="M 60 88 C 36 72, 28 52, 40 39 C 48 30, 60 36, 60 44 C 60 36, 72 30, 80 39 C 92 52, 84 72, 60 88 Z" fill={accent} fillOpacity={0.14} stroke={STROKE} strokeWidth={2.2} />
          <circle cx={60} cy={59} r={12} fill="none" stroke={accent} strokeWidth={2.2} strokeDasharray="4 3" />
        </g>
      );
    case 'fam-bebe':
      return (
        <g>
          <path d="M 28 62 Q 60 76, 92 62" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
          <path d="M 32 72 Q 60 86, 88 72" fill="none" stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M 42 46 Q 60 38, 78 46" fill="none" stroke={accent} strokeWidth={2.2} strokeDasharray="4 3" strokeLinecap="round" />
        </g>
      );
    case 'fam-familia':
      return (
        <g>
          <circle cx={60} cy={58} r={28} fill="none" stroke={accent} strokeWidth={2.4} strokeDasharray="6 4" />
          <circle cx={42} cy={58} r={7} fill={SKIN} stroke={STROKE} strokeWidth={2} />
          <circle cx={78} cy={58} r={7} fill={SKIN} stroke={STROKE} strokeWidth={2} />
          <circle cx={60} cy={38} r={7} fill={SKIN} stroke={STROKE} strokeWidth={2} />
        </g>
      );
    case 'voc-ayudar':
      return (
        <g>
          <rect x={30} y={70} width={60} height={12} rx={6} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
          <rect x={46} y={48} width={26} height={22} rx={8} fill={SKIN_SHADE} stroke={STROKE} strokeWidth={2.2} />
          <path d="M 60 28 L 60 42" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
          <polygon points="60,23 55,31 65,31" fill={accent} />
        </g>
      );
    case 'voc-escuchar':
      return (
        <g>
          <path d="M 48 34 C 34 34, 30 50, 38 64 C 42 71, 40 82, 48 84 C 54 85, 58 78, 56 72" fill={SKIN} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M 64 42 C 78 42, 82 68, 64 74" fill="none" stroke={accent} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      );
    case 'voc-ver':
    case 'con-visual':
      return (
        <g>
          <circle cx={42} cy={56} r={10} fill={SKIN} stroke={STROKE} strokeWidth={2.2} />
          <circle cx={42} cy={56} r={3.5} fill={STROKE} />
          <path d="M 56 50 L 92 42 M 56 62 L 92 70" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
          <polygon points="96,41 88,39 90,46" fill={accent} />
          <polygon points="96,71 90,66 88,73" fill={accent} />
        </g>
      );
    default: {
      // Clean stylized dual-hand / gesture vector motif
      return (
        <g>
          <circle cx={60} cy={58} r={32} fill={accent} fillOpacity={0.07} stroke={accent} strokeOpacity={0.3} strokeWidth={1.5} />
          <path
            d="M 44 74 L 44 50 C 44 46, 50 46, 50 50 L 50 62 M 50 44 C 50 40, 56 40, 56 44 L 56 60 M 56 46 C 56 42, 62 42, 62 46 L 62 61 M 62 50 C 62 46, 68 46, 68 50 L 68 68 C 68 78, 60 84, 52 84 C 45 84, 40 77, 40 68 L 40 60"
            fill={SKIN}
            stroke={STROKE}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 74 44 C 82 52, 82 66, 74 74" fill="none" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="3 3" />
        </g>
      );
    }
  }
}

export const HandSignSVG: React.FC<HandSignSVGProps> = ({
  signId,
  letter,
  color = '#0A1628',
  className = 'w-full h-full',
}) => {
  const handConfig = HAND_CONFIGS[signId];

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Ilustración de la seña ${letter} en LSV`}
    >
      <rect width="120" height="120" fill="#FAF9F6" />
      <g opacity="0.25">
        <line x1="20" y1="100" x2="100" y2="100" stroke="#CBD5E1" strokeWidth="1" />
      </g>
      {handConfig ? renderHandConfig(handConfig) : renderContextualSign(signId, letter, color)}
    </svg>
  );
};
