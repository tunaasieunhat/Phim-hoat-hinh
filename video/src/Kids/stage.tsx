// Shared stage pieces and props for the Grown-ups vs. Kids video (1920x1080).
import React from "react";
import { BLUE, DAD, INK, ORANGE, pop, tw } from "./rig";
import type { SceneData } from "./data";

export const W = 1920, H = 1080, GROUND = 800, MID = 960;
export const HAND = "KidsHand";
export const SANS = "KidsSans";
export const COOL = "#e8eef5", WARM = "#fff3d6";
export const FPS = 30;

// sentence start / end in local frames
export const cue = (sc: SceneData) => ({
  S: (i: number) => Math.round((sc.sentences[Math.min(i, sc.sentences.length - 1)]?.t0 ?? 0) * FPS),
  E: (i: number) => Math.round((sc.sentences[Math.min(i, sc.sentences.length - 1)]?.t1 ?? 0) * FPS),
});

export const Split: React.FC<{ f: number; divider?: number; merge?: number; children?: React.ReactNode }> = ({ divider = 1, merge = 0 }) => (
  <g>
    <rect x={0} y={0} width={MID} height={H} fill={COOL} />
    <rect x={MID} y={0} width={MID} height={H} fill={WARM} />
    {merge > 0 && <rect x={0} y={0} width={W} height={H} fill="#f6f1e6" opacity={merge} />}
    <line x1={40} y1={GROUND} x2={W - 40} y2={GROUND} stroke="#9aa6b5" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
    <line x1={MID} y1={0} x2={MID} y2={H * divider} stroke={INK} strokeWidth={6} strokeDasharray="2 18" strokeLinecap="round" opacity={0.55 * (1 - merge)} />
  </g>
);

export const Label: React.FC<{ f: number; text: string; x?: number }> = ({ f, text, x = MID }) => {
  const k = pop(f, 6, 16);
  return (
    <g transform={`translate(${x} 86) scale(${k}) rotate(-1.5)`}>
      <rect x={-text.length * 13 - 30} y={-40} width={text.length * 26 + 60} height={76} rx={14} fill="#fff" stroke={INK} strokeWidth={5} />
      <text x={0} y={14} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={INK}>{text}</text>
    </g>
  );
};
export const Tag: React.FC<{ x: number; y: number; text: string; k?: number; size?: number; color?: string; rot?: number; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, k = 1, size = 54, color = INK, rot = 0, anchor = "middle" }) =>
  k <= 0 ? null : (
    <text x={0} y={0} transform={`translate(${x} ${y}) scale(${k}) rotate(${rot})`} textAnchor={anchor} fontFamily={HAND} fontSize={size} fill={color}>{text}</text>
  );

export const Cloud: React.FC<{ x: number; y: number; s?: number; fill?: string; stroke?: string; opacity?: number }> = ({ x, y, s = 1, fill = "#fff", stroke = "#9aa6b5", opacity = 1 }) =>
  s <= 0.02 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path d="M -90 30 Q -130 30 -120 -5 Q -115 -40 -75 -35 Q -60 -80 -10 -65 Q 30 -95 65 -55 Q 115 -55 115 -10 Q 125 30 85 30 Z" fill={fill} stroke={stroke} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
// a cloud that looks exactly like a rabbit
export const RabbitCloud: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <g fill="#fff" stroke="#9aa6b5" strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={-52} cy={-92} rx={17} ry={50} transform="rotate(-14 -52 -92)" />
      <ellipse cx={-12} cy={-98} rx={17} ry={52} transform="rotate(8 -12 -98)" />
      <path d="M -110 40 Q -150 30 -130 -5 Q -120 -50 -60 -48 Q 0 -60 30 -20 Q 110 -40 135 10 Q 170 15 160 45 Q 120 60 -110 40 Z" />
      <circle cx={150} cy={12} r={22} />
    </g>
    <circle cx={-78} cy={-12} r={5} fill="#9aa6b5" />
    <path d="M -116 6 q 6 6 12 0" fill="none" stroke="#9aa6b5" strokeWidth={4} strokeLinecap="round" />
  </g>
);
export const Heart: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = "#ef4444" }) =>
  s <= 0.02 ? null : <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 34 C -60 -6 -40 -52 0 -22 C 40 -52 60 -6 0 34 Z" fill={fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
export const Shield: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) =>
  s <= 0.02 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 -44 L 38 -30 L 34 10 Q 30 36 0 48 Q -30 36 -34 10 L -38 -30 Z" fill={BLUE} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -16 2 L -4 14 L 18 -12" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
export const Star: React.FC<{ x: number; y: number; s?: number; fill?: string; rot?: number }> = ({ x, y, s = 1, fill = "#fbbf24", rot = 0 }) =>
  s <= 0.02 ? null : <path transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`} d="M 0 -22 L 6 -6 L 22 0 L 6 6 L 0 22 L -6 6 L -22 0 L -6 -6 Z" fill={fill} />;
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; k?: number; tail?: "left" | "right" | "none"; thought?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, k = 1, tail = "left", thought, children }) =>
  k <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.42} fill="#fff" stroke={INK} strokeWidth={5} />
      {tail !== "none" && !thought && <path d={tail === "left" ? `M ${-w * 0.25} ${h / 2 - 3} L ${-w * 0.36} ${h / 2 + 34} L ${-w * 0.1} ${h / 2 - 3}` : `M ${w * 0.25} ${h / 2 - 3} L ${w * 0.36} ${h / 2 + 34} L ${w * 0.1} ${h / 2 - 3}`} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
      {thought && [0, 1].map((i) => <circle key={i} cx={(tail === "left" ? -1 : 1) * (w * 0.3 + i * 22)} cy={h / 2 + 22 + i * 26} r={13 - i * 5} fill="#fff" stroke={INK} strokeWidth={4} />)}
      {children}
    </g>
  );
export const Bed: React.FC<{ x: number; w?: number; color?: string }> = ({ x, w = 480, color = "#b9cbe0" }) => (
  <g>
    <rect x={x} y={GROUND - 150} width={26} height={150} rx={8} fill="#b08968" stroke={INK} strokeWidth={5} />
    <rect x={x + 10} y={GROUND - 92} width={w} height={52} rx={12} fill="#f4ead2" stroke={INK} strokeWidth={5} />
    <rect x={x + 30} y={GROUND - 122} width={120} height={40} rx={18} fill="#fff" stroke={INK} strokeWidth={5} />
    <line x1={x + 40} y1={GROUND - 40} x2={x + 40} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <line x1={x + w - 20} y1={GROUND - 40} x2={x + w - 20} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <g opacity={0}><rect fill={color} /></g>
  </g>
);
export const Blanket: React.FC<{ x: number; w: number; color: string; lift?: number }> = ({ x, w, color, lift = 0 }) => (
  <path d={`M ${x} ${GROUND - 96} Q ${x + w * 0.3} ${GROUND - 150 - lift} ${x + w * 0.6} ${GROUND - 128 - lift * 0.5} Q ${x + w * 0.9} ${GROUND - 118} ${x + w} ${GROUND - 96} L ${x + w} ${GROUND - 44} L ${x} ${GROUND - 44} Z`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
);
export const Alarm: React.FC<{ x: number; y: number; ring?: number; f: number; color?: string; asleep?: boolean }> = ({ x, y, ring = 0, f, color = "#ef4444", asleep }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(f * 1.9) * 9 * ring})`}>
    <circle cx={-34} cy={-52} r={17} fill="#fbbf24" stroke={INK} strokeWidth={5} />
    <circle cx={34} cy={-52} r={17} fill="#fbbf24" stroke={INK} strokeWidth={5} />
    <circle r={52} fill={color} stroke={INK} strokeWidth={6} />
    <circle r={37} fill="#fff" stroke={INK} strokeWidth={4} />
    {asleep ? <path d="M -16 -4 q 8 8 16 0 M 2 -4 q 8 8 16 0 M -8 14 q 8 6 16 0" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" transform="translate(-2 -4)" /> : (<><line x1={0} y1={0} x2={0} y2={-26} stroke={INK} strokeWidth={6} strokeLinecap="round" /><line x1={0} y1={0} x2={18} y2={8} stroke={INK} strokeWidth={6} strokeLinecap="round" /></>)}
    <line x1={-30} y1={44} x2={-42} y2={62} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <line x1={30} y1={44} x2={42} y2={62} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    {ring > 0.3 && [-1, 1].map((s) => <path key={s} d={`M ${s * 70} -30 l ${s * 18} -10 M ${s * 76} 0 l ${s * 20} 0 M ${s * 70} 30 l ${s * 18} 10`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f * 1.3)} />)}
  </g>
);
export const Mug: React.FC<{ x: number; y: number; s?: number; f: number; color?: string }> = ({ x, y, s = 1, f, color = "#fff" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 22 -34 q 26 2 22 22 q -4 16 -22 14" fill="none" stroke={INK} strokeWidth={6} />
    <rect x={-24} y={-46} width={48} height={52} rx={8} fill={color} stroke={INK} strokeWidth={5} />
    {[0, 1].map((i) => <path key={i} d={`M ${-10 + i * 18} -56 q ${6 * Math.sin(f / 9 + i)} -12 0 -24 q ${-6 * Math.sin(f / 9 + i)} -12 0 -24`} fill="none" stroke="#9aa6b5" strokeWidth={4} strokeLinecap="round" opacity={0.8} />)}
  </g>
);
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) =>
  s <= 0.02 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
      <rect x={-20} y={-42} width={40} height={72} rx={8} fill="#1f2937" stroke={INK} strokeWidth={4} />
      <rect x={-15} y={-34} width={30} height={52} rx={3} fill="#93c5fd" />
    </g>
  );
export const Envelope: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <rect x={-28} y={-19} width={56} height={38} rx={5} fill="#fff" stroke={INK} strokeWidth={4} />
    <path d="M -28 -17 L 0 6 L 28 -17" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={26} cy={-18} r={9} fill="#ef4444" />
  </g>
);
export const Table: React.FC<{ x: number; y: number; w: number; color?: string }> = ({ x, y, w, color = "#e7c9a0" }) => (
  <g>
    <rect x={x} y={y} width={w} height={24} rx={8} fill={color} stroke={INK} strokeWidth={5} />
    <line x1={x + 30} y1={y + 24} x2={x + 30} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <line x1={x + w - 30} y1={y + 24} x2={x + w - 30} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" />
  </g>
);
export const Car: React.FC<{ x: number; y: number; color: string; s?: number; children?: React.ReactNode; bounce?: number }> = ({ x, y, color, s = 1, children, bounce = 0 }) => (
  <g transform={`translate(${x} ${y + bounce}) scale(${s})`}>
    <path d="M -150 0 L -150 -50 Q -146 -62 -120 -64 L -84 -116 Q -78 -126 -62 -126 L 46 -126 Q 62 -126 72 -112 L 104 -64 L 140 -58 Q 152 -54 152 -40 L 152 0 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -70 -66 L -46 -108 L 44 -108 L 78 -66 Z" fill="#dbeafe" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {children}
    {[-88, 92].map((cx) => <g key={cx}><circle cx={cx} cy={2} r={30} fill="#374151" stroke={INK} strokeWidth={6} /><circle cx={cx} cy={2} r={10} fill="#d1d5db" /></g>)}
  </g>
);
export const Tear: React.FC<{ x: number; y: number; f: number; phase?: number }> = ({ x, y, f, phase = 0 }) => {
  const t = ((f + phase) % 26) / 26;
  return <path transform={`translate(${x} ${y + t * 90}) scale(${1 - t * 0.3})`} d="M 0 -14 Q 12 4 0 12 Q -12 4 0 -14 Z" fill="#60a5fa" stroke={INK} strokeWidth={3} opacity={1 - t * 0.6} />;
};
export const QMark: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number; opacity?: number }> = ({ x, y, s = 1, color = ORANGE, rot = 0, opacity = 1 }) =>
  s <= 0.02 ? null : <text transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`} textAnchor="middle" fontFamily={HAND} fontSize={90} fill={color} opacity={opacity} stroke={INK} strokeWidth={2}>?</text>;
export const Zzz: React.FC<{ x: number; y: number; f: number; color?: string }> = ({ x, y, f, color = DAD }) => (
  <g>
    {[0, 1, 2].map((i) => { const t = ((f + i * 22) % 66) / 66; return <text key={i} x={x + t * 60} y={y - t * 110} fontFamily={HAND} fontSize={34 + t * 30} fill={color} opacity={1 - t}>z</text>; })}
  </g>
);
export const fadeIO = (f: number, total: number, n = 14) => Math.min(tw(f, 0, n), tw(f, total - n, total, 1, 0));
