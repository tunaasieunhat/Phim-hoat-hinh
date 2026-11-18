// Style-approval stills: Bob's character sheet and Gus's shop.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Head, INK } from "../Toon/Lily";
import { useToonFonts } from "../Toon/Stills";
import { Bob, BobHair, Gus } from "./cast";
import { H, Shop, W } from "./sets";

export const FreeBobSheet: React.FC = () => {
  useToonFonts();
  const heads = [["smug", "smug"], ["shock", "shock"], ["happy", "free stuff!"], ["worried", "hungry"]] as const;
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs><radialGradient id="bs" cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor="#e0f2fe" /><stop offset="0.6" stopColor="#7dd3fc" /><stop offset="1" stopColor="#1e3a5f" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#bs)" />
      <ellipse cx={540} cy={1600} rx={420} ry={60} fill="#1e3a5f" opacity={0.25} />
      <text x={540} y={150} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={110} fill="#fff" stroke={INK} strokeWidth={14} paintOrder="stroke fill">BOB</text>
      {heads.map(([e, label], i) => (
        <g key={e} transform={`translate(${150 + i * 260} 330)`}>
          <circle r={104} fill="#fff" opacity={0.35} />
          <Head id={`b${i}`} r={78} expr={e} hair={<BobHair r={78} />} back={null} />
          <text y={140} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={36} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">{label}</text>
        </g>
      ))}
      <Bob id="bob" x={540} y={1600} s={1.45} expr="smug" look={{ look: 0.3 }} pose={{ lean: -3, head: -6, aB: [-40, 30], aF: [130, 165], lB: [-8, -4], lF: [10, 6] }} fistF />
      <text x={540} y={1800} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">yellow cap · orange tee · jeans · sneakers</text>
    </svg></AbsoluteFill>
  );
};

export const FreeShop: React.FC = () => {
  useToonFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Shop f={f + 30} behind={<Gus id="gus" x={330} y={1240} s={0.95} expr="happy" pose={{ aB: [-120, -160], aF: [40, 10] }} />} />
      <Bob id="bob2" x={840} y={1700} s={0.9} flip expr="smug" pose={{ aF: [30, 10], aB: [-30, -10] }} />
    </svg></AbsoluteFill>
  );
};
