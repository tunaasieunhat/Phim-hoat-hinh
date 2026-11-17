// Shared pieces for "What Happens If You Don't Get Enough Sleep?" (9:16, no narration):
// energy bar over the head, bilingual labels, time tag, the bed with a face, helpers.
import React from "react";
import { interpolate } from "remotion";
import { joints, P, tw, type Pose } from "../Kids/rig";
import { INK } from "./people";

export const VW = 1080, VH = 1920, GY = 1360, FPS = 30, HAND = "KidsHand", S = 1.3; // the hero is drawn at 1.3x
export const sec = (s: number) => Math.round(s * FPS);
export const fadeIn = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// where the hero's head / hands are for a pose (props follow them)
export const body = (x: number, y: number, pose: Pose, flip = false, s = S) => joints("dad", x, y, s, pose, flip);
export const SITBED = P({ drop: 52, lL: [92, 88], lR: [88, 92] });

// a game-style energy bar floating above the head
export const EnergyBar: React.FC<{ x: number; y: number; pct: number; text?: string; shake?: number }> = ({ x, y, pct, text, shake = 0 }) => {
  const p = Math.max(0, Math.min(100, pct));
  const c = p > 60 ? "#22c55e" : p > 25 ? "#facc15" : "#ef4444";
  return (
    <g transform={`translate(${x + shake} ${y})`}>
      <rect x={-110} y={-24} width={220} height={48} rx={14} fill="#111827" stroke={INK} strokeWidth={5} />
      <rect x={-102} y={-16} width={204 * (p / 100)} height={32} rx={9} fill={c} />
      {[1, 2, 3].map((i) => <line key={i} x1={-102 + 51 * i} y1={-16} x2={-102 + 51 * i} y2={16} stroke="#111827" strokeWidth={3} opacity={0.5} />)}
      <rect x={110} y={-10} width={10} height={20} rx={3} fill={INK} />
      <text x={0} y={-36} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={38} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke fill">{text ?? `${Math.round(p)}%`}</text>
    </g>
  );
};

// bilingual label: English on top (pale yellow), Vietnamese below (white, black outline); shown 2–3 s
export const Label: React.FC<{ f: number; at: number; dur?: number; en: string; vi: string; y?: number }> = ({ f, at, dur = 90, en, vi, y = 420 }) => {
  if (f < at || f > at + dur) return null;
  const o = Math.min(fadeIn(f, at, at + 8), 1 - fadeIn(f, at + dur - 10, at + dur));
  const k = 0.85 + 0.15 * Math.min(1, (f - at) / 8);
  const big = (t: string) => (t.length > 26 ? 54 : 66);
  return (
    <g opacity={o} transform={`translate(540 ${y}) scale(${k})`} fontFamily="MedSans" fontWeight={700} textAnchor="middle" paintOrder="stroke fill" strokeLinejoin="round">
      <rect x={-500} y={-100} width={1000} height={190} rx={40} fill="rgba(15,23,42,0.62)" stroke="none" />
      <text y={-20} fontSize={big(en)} fill="#fde68a" stroke="#111827" strokeWidth={4}>{en}</text>
      <text y={60} fontSize={big(vi) - 6} fill="#fff" stroke="#000" strokeWidth={4}>{vi}</text>
    </g>
  );
};

// the clock tag in the top corner: time + day
export const TimeTag: React.FC<{ time: string; day?: string; pulse?: number; dark?: boolean }> = ({ time, day = "Day 1 / Ngày 1", pulse = 0, dark }) => (
  <g transform={`translate(60 170) scale(${1 + 0.12 * pulse})`}>
    <rect x={0} y={0} width={300} height={130} rx={24} fill={dark ? "#0f172a" : "#fff"} stroke={INK} strokeWidth={6} opacity={0.92} />
    <text x={150} y={72} textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontWeight={800} fontSize={64} fill={dark ? "#f87171" : INK}>{time}</text>
    <text x={150} y={114} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={28} fill={dark ? "#cbd5e1" : "#475569"}>{day}</text>
  </g>
);

// the bed: a headboard with a face, a bouncing pillow, and a blanket corner that waves like an arm
export const Bed: React.FC<{ x: number; f: number; wave?: number; mood?: "smile" | "sad" | "hug"; blanket?: boolean; w?: number; tilt?: number }> = ({ x, f, wave = 0, mood = "smile", blanket = true, w = 600, tilt = 0 }) => {
  const top = GY - 200;
  const bounce = wave > 0 ? Math.abs(Math.sin(f / 5)) * 16 * wave : 0;
  const arm = wave > 0 ? -30 - 40 * (0.5 + 0.5 * Math.sin(f / 4)) * wave : -10;
  return (
    <g transform={`rotate(${tilt} ${x + w / 2} ${GY})`}>
      {/* headboard with a face */}
      <rect x={x - 20} y={GY - 440} width={70} height={440} rx={22} fill="#b08968" stroke={INK} strokeWidth={6} />
      <g transform={`translate(${x + 15} ${GY - 360})`}>
        {[-14, 14].map((dx) => <ellipse key={dx} cx={dx} cy={0} rx={8} ry={mood === "sad" ? 6 : 11} fill={INK} />)}
        {mood === "sad" ? <path d="M -14 36 Q 0 24 14 36" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /> : <path d="M -16 26 Q 0 42 16 26" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {mood !== "sad" && [-22, 22].map((dx) => <ellipse key={dx} cx={dx} cy={16} rx={7} ry={4} fill="#f87171" opacity={0.6} />)}
      </g>
      <rect x={x} y={top} width={w} height={90} rx={18} fill="#e2e8f0" stroke={INK} strokeWidth={6} />
      <rect x={x + 10} y={top + 90} width={w - 20} height={30} rx={10} fill="#b08968" stroke={INK} strokeWidth={5} />
      <line x1={x + 40} y1={top + 120} x2={x + 40} y2={GY} stroke={INK} strokeWidth={12} strokeLinecap="round" /><line x1={x + w - 40} y1={top + 120} x2={x + w - 40} y2={GY} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      {/* pillow */}
      <g transform={`translate(${x + 130} ${top}) scale(1 ${1 + bounce / 80})`}><rect x={-80} y={-70 - bounce * 0.3} width={160} height={70} rx={30} fill="#f8fafc" stroke={INK} strokeWidth={6} /></g>
      {/* blanket and its waving corner */}
      {blanket && <g>
        <path d={`M ${x + 230} ${top + 4} Q ${x + 260} ${top - 70} ${x + 420} ${top - 60} Q ${x + w - 20} ${top - 50} ${x + w} ${top + 40} L ${x + w} ${top + 90} L ${x + 230} ${top + 90} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <g transform={`translate(${x + w - 10} ${top + 10}) rotate(${arm})`}><path d="M 0 0 Q 30 -20 70 -10 Q 110 0 120 30 Q 90 40 60 34 Q 20 30 0 40 Z" fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>
      </g>}
    </g>
  );
};

export const Phone: React.FC<{ x: number; y: number; f: number; glow?: number; rot?: number }> = ({ x, y, f, glow = 1, rot = -20 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-26} y={-46} width={52} height={92} rx={9} fill="#111827" stroke={INK} strokeWidth={4} />
    <rect x={-20} y={-38} width={40} height={74} rx={4} fill="#38bdf8" opacity={0.6 + 0.4 * glow} />
    {[0, 1, 2].map((i) => <rect key={i} x={-16} y={-34 + ((i * 26 + f * 4) % 70)} width={32} height={18} rx={3} fill={["#f472b6", "#fde047", "#a3e635"][i]} opacity={0.85} />)}
  </g>
);

export { tw };
