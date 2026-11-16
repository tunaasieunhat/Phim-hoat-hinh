// Shared pieces for "5 Types of Teams" (9:16): team sign, result bar, icons, the table with three people,
// speech bubbles that follow whoever is talking.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, P, pop, tw, type Pose } from "../Kids/rig";
import { Desk, GY, HAND, Stool } from "../Med/scenes";
import type { Line, SceneData } from "./data";
import { CAST, INK, Person, RED, type Face } from "./people";

export { GY, HAND };
export const VW = 1080, VH = 1920, FPS = 30;
export type SP = { sc: SceneData };
export const SIT: Pose = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [48, 90], aR: [56, 94], lean: -4 });
export const SIT_BACK: Pose = P({ drop: 46, lL: [-30, -10], lR: [30, 10], aL: [-34, -14], aR: [34, 14] });
export const SEATS: [number, number, number] = [210, 540, 870];

// who is talking now, and when each line starts / ends (frames)
export const useTalk = (sc: SceneData) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cur: Line | undefined = sc.lines.find((l) => t >= l.t0 - 0.05 && t < l.t1 + 0.12);
  const speakers = cur ? cur.who.split("&").map((w) => w.trim()) : [];
  const L = (i: number) => Math.round(sc.lines[Math.min(i, sc.lines.length - 1)].t0 * FPS);
  const LE = (i: number) => Math.round(sc.lines[Math.min(i, sc.lines.length - 1)].t1 * FPS);
  // the first line spoken by someone (or containing some text)
  const at = (who: string, n = 0) => { const ls = sc.lines.map((l, i) => [l, i] as const).filter(([l]) => l.who === who); return L(ls[Math.min(n, ls.length - 1)][1]); };
  const find = (text: string) => L(Math.max(0, sc.lines.findIndex((l) => l.en.includes(text))));
  return { f, t, cur, speakers, L, LE, at, find };
};

// talking: a small hop and a moving mouth
export const talkDy = (f: number, on: boolean) => (on ? -Math.abs(Math.sin(f / 4.2)) * 9 : 0);
export const talkMouth = (f: number, on: boolean, base: Face["mouth"] = "smile"): Face["mouth"] => (on ? (Math.floor(f / 4) % 3 === 0 ? "o" : Math.floor(f / 4) % 3 === 1 ? "grin" : base) : base);

const Icon: React.FC<{ kind: string; s?: number }> = ({ kind, s = 1 }) => {
  const g = (c: React.ReactNode) => <g transform={`scale(${s})`}>{c}</g>;
  if (kind === "bolt") return g(<path d="M 10 -60 L -30 6 L -2 6 L -14 60 L 32 -10 L 4 -10 L 18 -60 Z" fill="#facc15" stroke={INK} strokeWidth={6} strokeLinejoin="round" />);
  if (kind === "fire") return g(<g><path d="M 0 60 C -46 60 -50 10 -30 -14 C -26 6 -12 10 -10 -6 C -12 -30 0 -48 14 -62 C 12 -34 40 -24 40 10 C 40 40 24 60 0 60 Z" fill="#f97316" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M 0 54 C -18 54 -22 32 -10 18 C -6 28 4 26 4 14 C 16 24 22 36 18 44 C 14 52 8 54 0 54 Z" fill="#fde047" /></g>);
  if (kind === "zzz") return g(<g fontFamily={HAND} fill="#93c5fd" stroke={INK} strokeWidth={4} paintOrder="stroke fill"><text x={-46} y={40} fontSize={70}>Z</text><text x={0} y={6} fontSize={52}>z</text><text x={30} y={-24} fontSize={40}>z</text></g>);
  if (kind === "party") return g(<g><path d="M -40 56 L 4 -40 L 40 26 Z" fill="#f472b6" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M -22 18 L 18 34 M -8 -12 L 28 6" stroke="#fde047" strokeWidth={8} />{[[20, -56, "#22c55e"], [46, -30, "#3b82f6"], [-6, -64, "#facc15"], [52, -60, RED]].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width={12} height={12} fill={c as string} transform={`rotate(${i * 30} ${x} ${y})`} />)}</g>);
  return g(<path d="M -44 -44 L -10 -44 A 14 14 0 1 1 10 -44 L 44 -44 L 44 -10 A 14 14 0 1 0 44 10 L 44 44 L -44 44 L -44 10 A 14 14 0 1 1 -44 -10 Z" fill="#a78bfa" stroke={INK} strokeWidth={6} strokeLinejoin="round" />);
};
export { Icon };

// the team sign slides in from the left with a "ting"
export const TeamSign: React.FC<{ f: number; icon: string; en: string; vi: string; color: string }> = ({ f, icon, en, vi, color }) => {
  const k = tw(f, 2, 18);
  return (
    <g transform={`translate(${-1000 + 1000 * k} 0)`}>
      <rect x={60} y={120} width={960} height={190} rx={34} fill={color} stroke={INK} strokeWidth={8} />
      <circle cx={170} cy={215} r={74} fill="#fff" stroke={INK} strokeWidth={6} />
      <g transform={`translate(170 215) rotate(${Math.sin(f / 9) * 6}) scale(${pop(f, 14, 12)})`}><Icon kind={icon} s={0.95} /></g>
      <text x={270} y={210} fontFamily={HAND} fontSize={74} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">{en}</text>
      <text x={272} y={274} fontFamily="MedSans" fontWeight={700} fontSize={40} fill={INK}>{vi}</text>
    </g>
  );
};

export const ResultBar: React.FC<{ f: number; at: number; text: string; color?: string }> = ({ f, at, text, color = "#16a34a" }) => {
  const k = pop(f, at, 14);
  return k <= 0 ? null : (
    <g transform={`translate(540 400) scale(${k})`}>
      <rect x={-430} y={-52} width={860} height={104} rx={52} fill="#fff" stroke={INK} strokeWidth={7} />
      <rect x={-430} y={-52} width={250} height={104} rx={52} fill={color} />
      <rect x={-260} y={-52} width={80} height={104} fill={color} />
      <text x={-305} y={18} textAnchor="middle" fontFamily={HAND} fontSize={52} fill="#fff">Result</text>
      <text x={110} y={20} textAnchor="middle" fontFamily={HAND} fontSize={text.length > 20 ? 46 : 58} fill={INK}>{text}</text>
    </g>
  );
};

// a speech bubble above a speaker, holding the current line (long lines become "...")
export const Speech: React.FC<{ x: number; y: number; text: string; k: number; tail?: "left" | "right" | "none"; color?: string; shout?: boolean }> = ({ x, y, text, k, tail = "left", color = "#fff", shout }) => {
  if (k <= 0) return null;
  const words = text.split(" ");
  const rows: string[] = [];
  for (const w of words) { const last = rows[rows.length - 1]; if (last && (last + " " + w).length <= 18) rows[rows.length - 1] = last + " " + w; else rows.push(w); }
  const shown = rows.slice(0, 3);
  const fs = shout ? 50 : 42;
  const w = Math.max(...shown.map((r) => r.length)) * fs * 0.5 + 70, h = shown.length * fs * 1.12 + 44;
  const tx = tail === "left" ? -w * 0.22 : w * 0.22;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {shout ? <path d={`M ${-w / 2 - 14} 0 L ${-w / 2} ${-h / 2} L ${-w / 4} ${-h / 2 - 16} L 0 ${-h / 2} L ${w / 4} ${-h / 2 - 16} L ${w / 2} ${-h / 2} L ${w / 2 + 14} 0 L ${w / 2} ${h / 2} L ${w / 4} ${h / 2 + 14} L 0 ${h / 2} L ${-w / 4} ${h / 2 + 14} L ${-w / 2} ${h / 2} Z`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(40, h * 0.4)} fill={color} stroke={INK} strokeWidth={5} />}
      {tail !== "none" && !shout && <path d={`M ${tx - 18} ${h / 2 - 3} L ${tx + (tail === "left" ? -26 : 26)} ${h / 2 + 34} L ${tx + 18} ${h / 2 - 3}`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
      {tail !== "none" && !shout && <rect x={tx - 16} y={h / 2 - 8} width={32} height={8} fill={color} />}
      {shown.map((r, i) => <text key={i} x={0} y={-h / 2 + 22 + fs * 0.92 + i * fs * 1.12} textAnchor="middle" fontFamily={HAND} fontSize={fs} fill={INK}>{r}</text>)}
    </g>
  );
};

// three people around a table: left (faces right), back (faces you), right (faces left)
export const Table: React.FC<{
  f: number; names: [string, string, string]; speakers: string[]; poses?: Partial<Record<string, Pose>>; faces?: Partial<Record<string, Face>>;
  standing?: boolean; desk?: string; children?: React.ReactNode; front?: React.ReactNode; dy?: Partial<Record<string, number>>;
}> = ({ f, names, speakers, poses = {}, faces = {}, standing, desk = "#c79a6b", children, front, dy = {} }) => {
  const [a, b, c] = names;
  const pose = (n: string, base: Pose, seed: number) => { const p = poses[n] ?? base; return alive({ ...p, dy: p.dy + talkDy(f, speakers.includes(n)) + (dy[n] ?? 0) }, f, 0.7, seed); };
  const face = (n: string, look: number): Face => { const fc = faces[n] ?? {}; return { eyes: "open", look, ...fc, mouth: talkMouth(f, speakers.includes(n), fc.mouth ?? "smile") }; };
  const stand = P({ aL: [-14, -6], aR: [14, 6] });
  return (
    <g>
      {!standing && <Stool x={SEATS[1]} />}
      <Person who={b} x={SEATS[1]} y={GY} pose={pose(b, standing ? stand : SIT_BACK, 7)} f={f} face={face(b, 0)} />
      {!standing && <Stool x={SEATS[0]} />}
      {!standing && <Stool x={SEATS[2]} />}
      <Person who={a} x={SEATS[0]} y={GY} pose={pose(a, standing ? stand : SIT, 0)} f={f} face={face(a, 0.7)} />
      <Person who={c} x={SEATS[2]} y={GY} pose={pose(c, standing ? stand : SIT, 21)} f={f} flip face={face(c, 0.7)} />
      <Desk x={290} w={500} color={desk} />
      {children}
      {front}
    </g>
  );
};

export const shirt = (n: string) => CAST[n]?.cardigan ?? INK;
