import React from "react";

const INK = "#3B2A2A";

type PersonProps = {
  x: number;
  y: number; // feet position
  s?: number;
  skin?: string;
  hair?: string;
  top?: string;
  bottom?: string;
  aoDai?: boolean;
  nonLa?: boolean;
  longHair?: boolean;
  arm?: number; // right arm angle in degrees (0 = down, 90 = forward)
  armL?: number;
  flip?: boolean;
  sitting?: boolean;
  bag?: string;
};

// Flat storybook character, drawn around (0,0) = feet, ~300px tall at s=1
export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  skin = "#F7CFA8",
  hair = "#2B1B14",
  top = "#FFFFFF",
  bottom = "#2E5AAC",
  aoDai = false,
  nonLa = false,
  longHair = false,
  arm = 10,
  armL = -10,
  flip = false,
  sitting = false,
  bag,
}) => {
  const legH = sitting ? 0 : 90;
  const bodyTop = -legH - 120;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* legs */}
      {!sitting && (
        <>
          <rect x={-26} y={-legH} width={20} height={legH} rx={8} fill={aoDai ? "#FFFFFF" : bottom} stroke={INK} strokeWidth={3} />
          <rect x={6} y={-legH} width={20} height={legH} rx={8} fill={aoDai ? "#FFFFFF" : bottom} stroke={INK} strokeWidth={3} />
          <ellipse cx={-16} cy={0} rx={18} ry={8} fill={INK} />
          <ellipse cx={16} cy={0} rx={18} ry={8} fill={INK} />
        </>
      )}
      {/* backpack */}
      {bag && <rect x={-58} y={bodyTop + 14} width={40} height={78} rx={12} fill={bag} stroke={INK} strokeWidth={3} />}
      {/* left arm (behind) */}
      <g transform={`translate(-34 ${bodyTop + 14}) rotate(${armL})`}>
        <rect x={-9} y={0} width={18} height={92} rx={9} fill={top} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={96} r={11} fill={skin} stroke={INK} strokeWidth={3} />
      </g>
      {/* body */}
      {aoDai ? (
        <path
          d={`M -32 ${bodyTop} Q 0 ${bodyTop - 10} 32 ${bodyTop} L 46 ${-legH + 70} L -46 ${-legH + 70} Z`}
          fill={top}
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ) : (
        <path
          d={`M -34 ${bodyTop} Q 0 ${bodyTop - 8} 34 ${bodyTop} L 38 ${-legH} L -38 ${-legH} Z`}
          fill={top}
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      )}
      {/* collar */}
      <path d={`M -14 ${bodyTop - 2} L 0 ${bodyTop + 16} L 14 ${bodyTop - 2}`} fill="none" stroke={INK} strokeWidth={3} />
      {/* neck + head */}
      <rect x={-9} y={bodyTop - 18} width={18} height={20} fill={skin} />
      {longHair && (
        <>
          <path d={`M -48 ${bodyTop - 70} Q -56 ${bodyTop + 10} -40 ${bodyTop + 50} L -24 ${bodyTop + 50} L -30 ${bodyTop - 60} Z`} fill={hair} stroke={INK} strokeWidth={3} />
          <path d={`M 48 ${bodyTop - 70} Q 56 ${bodyTop + 10} 40 ${bodyTop + 50} L 24 ${bodyTop + 50} L 30 ${bodyTop - 60} Z`} fill={hair} stroke={INK} strokeWidth={3} />
        </>
      )}
      <circle cx={0} cy={bodyTop - 62} r={46} fill={skin} stroke={INK} strokeWidth={3} />
      <path d={`M -47 ${bodyTop - 62} Q -44 ${bodyTop - 118} 0 ${bodyTop - 112} Q 44 ${bodyTop - 118} 47 ${bodyTop - 62} Q 20 ${bodyTop - 92} -47 ${bodyTop - 62} Z`} fill={hair} stroke={INK} strokeWidth={3} />
      {/* face */}
      <circle cx={-15} cy={bodyTop - 58} r={5} fill={INK} />
      <circle cx={17} cy={bodyTop - 58} r={5} fill={INK} />
      <circle cx={-26} cy={bodyTop - 44} r={7} fill="#F59A9A" opacity={0.6} />
      <circle cx={28} cy={bodyTop - 44} r={7} fill="#F59A9A" opacity={0.6} />
      <path d={`M -10 ${bodyTop - 40} Q 2 ${bodyTop - 30} 14 ${bodyTop - 40}`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      {nonLa && (
        <path d={`M -78 ${bodyTop - 92} L 0 ${bodyTop - 150} L 78 ${bodyTop - 92} Z`} fill="#F2D48A" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      )}
      {/* right arm (front) */}
      <g transform={`translate(34 ${bodyTop + 14}) rotate(${-arm})`}>
        <rect x={-9} y={0} width={18} height={92} rx={9} fill={top} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={96} r={11} fill={skin} stroke={INK} strokeWidth={3} />
      </g>
    </g>
  );
};

// A flower made of round petals
export const Flower: React.FC<{ x: number; y: number; r: number; color: string; grow?: number; spin?: number }> = ({
  x,
  y,
  r,
  color,
  grow = 1,
  spin = 0,
}) => {
  if (grow <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${grow}) rotate(${spin})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.62} cy={Math.sin((a * Math.PI) / 180) * r * 0.62} r={r * 0.55} fill={color} stroke={INK} strokeWidth={2.5} />
      ))}
      <circle r={r * 0.36} fill="#FFD447" stroke={INK} strokeWidth={2.5} />
    </g>
  );
};

export const PaperPlane: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = "#FFFFFF" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -14 L 44 0 L -40 18 L -22 2 Z" fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M -22 2 L 44 0 L -30 30 Z" fill="#E3E9F2" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.95}>
    <ellipse cx={0} cy={0} rx={90} ry={42} fill="#FFFFFF" />
    <ellipse cx={-60} cy={12} rx={60} ry={32} fill="#FFFFFF" />
    <ellipse cx={64} cy={14} rx={62} ry={30} fill="#FFFFFF" />
    <ellipse cx={10} cy={-30} rx={56} ry={40} fill="#FFFFFF" />
  </g>
);

export { INK };
