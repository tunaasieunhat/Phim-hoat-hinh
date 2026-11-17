// Shared pieces for "Rainy day: plan vs. reality" (9:16): the rain cloud with a face, PLAN / REALITY badges,
// the tear that rips the bright PLAN frame away to reveal the grey REALITY, the window with rain.
import React from "react";
import { INK } from "../Sleep/people";
import { GY, HAND, VH, VW } from "../Sleep/stage";
import type { SceneData } from "./data";

export { GY, HAND, VH, VW, INK };
export const UP = 110, FLOOR = GY - UP; // action sits above the subtitles
export type SP = { sc: SceneData };
// start / end time (s) of the n-th line, or of the first line that contains some text
export const lines = (sc: SceneData) => ({
  T: (i: number) => sc.lines[Math.min(i, sc.lines.length - 1)].t0,
  E: (i: number) => sc.lines[Math.min(i, sc.lines.length - 1)].t1,
  find: (text: string) => sc.lines.find((l) => l.en.includes(text))?.t0 ?? 0,
});

// the rain cloud: a face, a little arm, its own rain; it follows Lily around
export const RainCloud: React.FC<{ x: number; y: number; f: number; s?: number; wave?: number; rain?: number; mood?: "smile" | "grin" | "sly" | "chew"; popcorn?: boolean }> = ({ x, y, f, s = 1, wave = 0, rain = 1, mood = "smile", popcorn }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 14) * 6}) scale(${s})`}>
    {rain > 0 && Array.from({ length: 9 }).map((_, i) => { const t = ((f * 2.2 + i * 37) % 120) / 120; return <line key={i} x1={-110 + i * 28} y1={50 + t * 260} x2={-116 + i * 28} y2={78 + t * 260} stroke="#60a5fa" strokeWidth={6} strokeLinecap="round" opacity={rain * (1 - t * 0.6)} />; })}
    <g transform={`translate(120 -6) rotate(${-40 - 50 * wave * (0.5 + 0.5 * Math.sin(f / 3))})`}><path d="M 0 0 Q 40 -10 60 -40" stroke="#64748b" strokeWidth={16} fill="none" strokeLinecap="round" /><circle cx={62} cy={-44} r={14} fill="#94a3b8" stroke={INK} strokeWidth={4} /></g>
    <path d="M -130 40 Q -170 40 -165 0 Q -160 -40 -115 -40 Q -110 -90 -55 -95 Q -20 -130 30 -110 Q 80 -130 105 -80 Q 160 -80 160 -20 Q 175 40 120 40 Z" fill="#94a3b8" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {mood === "sly" ? [-40, 30].map((ex) => <path key={ex} d={`M ${ex - 14} -30 q 14 -10 28 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />)
      : [-40, 30].map((ex) => <g key={ex}><circle cx={ex} cy={-30} r={13} fill="#fff" stroke={INK} strokeWidth={4} /><circle cx={ex + 3} cy={-28} r={6} fill={INK} /></g>)}
    {mood === "chew" ? <ellipse cx={-5} cy={6} rx={16} ry={6 + 5 * Math.abs(Math.sin(f / 3))} fill={INK} />
      : <path d={mood === "grin" || mood === "sly" ? "M -32 -4 Q -5 26 22 -4 Z" : "M -26 0 Q -5 16 16 0"} fill={mood === "grin" || mood === "sly" ? "#fff" : "none"} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    {popcorn && <g transform="translate(-120 30)"><path d="M -30 -40 L 30 -40 L 22 30 L -22 30 Z" fill="#fff" stroke={INK} strokeWidth={4} />{[-14, 0, 14].map((x) => <rect key={x} x={x - 4} y={-40} width={8} height={70} fill="#ef4444" opacity={0.8} />)}{[-20, -4, 12, 24, -10, 6].map((x, i) => <circle key={i} cx={x} cy={-46 - (i % 2) * 12} r={11} fill="#fef3c7" stroke={INK} strokeWidth={3} />)}</g>}
  </g>
);

export const Badge: React.FC<{ kind: "PLAN" | "REALITY"; k: number; f: number }> = ({ kind, k, f }) => k <= 0.01 ? null : (
  <g transform={`translate(${kind === "PLAN" ? 230 : 290} 210) rotate(${kind === "PLAN" ? -5 : 3}) scale(${k})`}>
    <rect x={kind === "PLAN" ? -160 : -220} y={-62} width={kind === "PLAN" ? 320 : 440} height={124} rx={22} fill={kind === "PLAN" ? "#facc15" : "#475569"} stroke={INK} strokeWidth={8} />
    <text y={6} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={64} fill={kind === "PLAN" ? INK : "#e2e8f0"}>{kind}</text>
    <text y={46} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={30} fill={kind === "PLAN" ? "#713f12" : "#cbd5e1"}>{kind === "PLAN" ? "Kế hoạch" : "Thực tế"}</text>
    {kind === "PLAN" && [[-170, -70], [170, -60], [150, 70]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * Math.sin(f / 5 + i)})`} d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#fde047" stroke={INK} strokeWidth={3} />)}
    {kind === "REALITY" && <path transform="translate(-180 -10)" d="M 0 -26 Q 18 0 18 12 A 18 18 0 0 1 -18 12 Q -18 0 0 -26 Z" fill="#60a5fa" stroke={INK} strokeWidth={3} />}
  </g>
);

// bilingual plan label (English on top, Vietnamese below) on a dark band, under the badge
export const PlanLabel: React.FC<{ k: number; en: string; vi: string }> = ({ k, en, vi }) => k <= 0.01 ? null : (
  <g opacity={k} transform={`translate(540 380) scale(${0.9 + 0.1 * k})`} fontFamily="MedSans" fontWeight={700} textAnchor="middle">
    <rect x={-470} y={-70} width={940} height={150} rx={34} fill="rgba(15,23,42,0.62)" />
    <text y={-8} fontSize={54} fill="#fde68a">{en}</text>
    <text y={54} fontSize={48} fill="#fff">{vi}</text>
  </g>
);

// the PLAN frame tears down the middle and both halves fall away (p: 0 → 1)
const TEAR = "540,-20 500,180 580,330 490,520 600,700 510,880 590,1080 500,1260 580,1460 520,1660 560,1940";
export const Tear: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => {
  if (p >= 1) return null;
  const pts = TEAR.split(" ");
  const left = `-20,-20 ${pts.join(" ")} -20,1940`, right = `1100,-20 ${pts.join(" ")} 1100,1940`;
  const e = p * p;
  return (
    <g>
      <clipPath id="tearL"><polygon points={left} /></clipPath><clipPath id="tearR"><polygon points={right} /></clipPath>
      <g transform={`translate(${-e * 760} ${e * 300}) rotate(${-e * 14} 540 960)`}><g clipPath="url(#tearL)">{children}</g><polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={p > 0 ? 10 : 0} /></g>
      <g transform={`translate(${e * 760} ${e * 380}) rotate(${e * 16} 540 960)`}><g clipPath="url(#tearR)">{children}</g><polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={p > 0 ? 10 : 0} /></g>
    </g>
  );
};

// a window: sunny or rainy outside
export const Window: React.FC<{ x: number; y: number; w: number; h: number; f: number; rain: number; curtain?: number; children?: React.ReactNode }> = ({ x, y, w, h, f, rain, curtain = 1, children }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={10} fill={rain > 0.5 ? "#64748b" : "#7dd3fc"} stroke={INK} strokeWidth={9} />
    <clipPath id={`win${x}`}><rect x={x} y={y} width={w} height={h} rx={10} /></clipPath>
    <g clipPath={`url(#win${x})`}>
      {rain <= 0.5 && <circle cx={x + w - 70} cy={y + 70} r={44} fill="#fde047" />}
      {children}
      {rain > 0 && Array.from({ length: 26 }).map((_, i) => { const t = ((f * 3.1 + i * 53) % 100) / 100; const rx = x + ((i * 97) % w); return <line key={i} x1={rx} y1={y + t * h * 1.1 - 40} x2={rx - 8} y2={y + t * h * 1.1} stroke="#bfdbfe" strokeWidth={4} strokeLinecap="round" opacity={rain * 0.85} />; })}
    </g>
    <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeWidth={7} /><line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={INK} strokeWidth={7} />
    {/* curtains: 1 = open, 0 = closed */}
    <path d={`M ${x - 30} ${y - 20} L ${x + (w / 2) * (1 - curtain) + 20} ${y - 20} Q ${x + (w / 2) * (1 - curtain) - 10} ${y + h / 2} ${x + (w / 2) * (1 - curtain) + 30} ${y + h + 30} L ${x - 30} ${y + h + 30} Z`} fill="#f9a8d4" stroke={INK} strokeWidth={6} />
    <path d={`M ${x + w + 30} ${y - 20} L ${x + w - (w / 2) * (1 - curtain) - 20} ${y - 20} Q ${x + w - (w / 2) * (1 - curtain) + 10} ${y + h / 2} ${x + w - (w / 2) * (1 - curtain) - 30} ${y + h + 30} L ${x + w + 30} ${y + h + 30} Z`} fill="#f9a8d4" stroke={INK} strokeWidth={6} />
    <rect x={x - 50} y={y - 34} width={w + 100} height={16} rx={8} fill="#78716c" />
  </g>
);
