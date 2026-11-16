// Scenes 1–3 of "POV: A Day in the Life of an IT Student" — native 9:16 (1080x1920), action between y 150 and 1300.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, mix, P, pop, STAND, tw } from "../Kids/rig";
import { Bubble } from "../Kids/stage";
import { cue, Desk, HAND, pulse, Stool, Txt, VH, VW, GY } from "../Med/scenes";
import type { SceneData } from "./data";
import { INK, Person, RED } from "./people";

export type SP = { sc: SceneData };
export const SIT = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [48, 90], aR: [56, 94], lean: -4 });
export const GREEN = "#22c55e";
export const MONO = "ui-monospace, Menlo, monospace";

// typing on a keyboard: forearms tap
export const typing = (f: number, k = 1): Partial<ReturnType<typeof P>> => ({ aL: [48, 90 + Math.sin(f * 1.9) * 7 * k], aR: [56, 94 + Math.sin(f * 2.3 + 1) * 7 * k] });

export const PovTag: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(60 70) rotate(-4) scale(${pop(f, 6, 14)})`}><rect width={200} height={92} rx={16} fill={RED} /><text x={100} y={66} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#fff">POV:</text></g>
);

// a laptop seen from the front, sitting on a desk top at y; stickers on the lid's rim
export const Laptop: React.FC<{ x: number; y: number; f: number; mode: "error" | "code" | "ok" | "off"; s?: number }> = ({ x, y, f, mode, s = 1 }) => {
  const blink = Math.floor(f / 10) % 2 === 0;
  const bg = mode === "error" ? "#3b0d0d" : mode === "ok" ? "#052e16" : mode === "off" ? "#111827" : "#1e1e2e";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {mode === "error" && <circle cx={0} cy={-100} r={170} fill={RED} opacity={0.12 + (blink ? 0.06 : 0)} />}
      {mode === "ok" && <circle cx={0} cy={-100} r={170} fill={GREEN} opacity={0.18} />}
      <rect x={-130} y={-190} width={260} height={176} rx={12} fill="#cbd5e1" stroke={INK} strokeWidth={6} />
      <rect x={-114} y={-176} width={228} height={148} rx={6} fill={bg} />
      {mode === "error" && <g><text x={0} y={-92} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={44} fill={blink ? "#f87171" : "#b91c1c"}>ERROR</text><path d="M -20 -70 L 20 -40 M 20 -70 L -20 -40" stroke="#f87171" strokeWidth={8} strokeLinecap="round" /></g>}
      {mode === "ok" && <text x={0} y={-86} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40} fill="#4ade80">SUCCESS</text>}
      {mode === "code" && [0, 1, 2, 3, 4].map((i) => <rect key={i} x={-100 + (i % 2) * 20} y={-162 + i * 26} width={90 + ((i * 53) % 90)} height={12} rx={4} fill={["#c084fc", "#60a5fa", "#fbbf24", "#34d399", "#f472b6"][i]} opacity={0.85} />)}
      {[[-112, -184, "#f472b6"], [104, -184, "#facc15"], [-118, -26, "#38bdf8"], [116, -30, "#a3e635"]].map(([cx, cy, c], i) => <circle key={i} cx={cx as number} cy={cy as number} r={11} fill={c as string} stroke={INK} strokeWidth={3} />)}
      <path d="M -150 0 L 150 0 L 130 -14 L -130 -14 Z" fill="#94a3b8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

// the big code editor that fills the top of the frame in scenes 2 and 5
export const Editor: React.FC<{ f: number; errors: number; hi?: number; gone?: number; run?: number; state: "code" | "error" | "ok"; flood?: number; face?: number; title?: string }> = ({ f, errors, hi = -1, gone = 0, run = 0, state, flood = 0, face = 0, title = "main.py" }) => {
  const x0 = 90, y0 = 160, w = 900, h = 720;
  const border = state === "ok" ? GREEN : state === "error" ? RED : "#475569";
  const lines = Array.from({ length: 12 });
  return (
    <g>
      <rect x={x0 - 10} y={y0 - 10} width={w + 20} height={h + 20} rx={26} fill={border} opacity={state === "code" ? 0 : 0.35} />
      <rect x={x0} y={y0} width={w} height={h} rx={20} fill="#1e1e2e" stroke={INK} strokeWidth={8} />
      <rect x={x0} y={y0} width={w} height={64} rx={20} fill="#313244" /><rect x={x0} y={y0 + 40} width={w} height={24} fill="#313244" />
      {[0, 1, 2].map((i) => <circle key={i} cx={x0 + 40 + i * 34} cy={y0 + 32} r={11} fill={["#f87171", "#fbbf24", "#4ade80"][i]} />)}
      <text x={x0 + 160} y={y0 + 44} fontFamily={MONO} fontSize={30} fill="#cdd6f4">{title}</text>
      {/* the Run button */}
      <g transform={`translate(${x0 + w - 110} ${y0 + 32}) scale(${1 - 0.18 * run})`}>
        <rect x={-80} y={-24} width={160} height={48} rx={12} fill={run > 0.3 ? "#15803d" : GREEN} stroke={INK} strokeWidth={4} />
        <path d="M -50 -12 L -28 0 L -50 12 Z" fill="#fff" /><text x={14} y={11} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={28} fill="#fff">Run</text>
      </g>
      {face > 0 ? (
        <g transform={`translate(${x0 + w / 2} ${y0 + 340}) scale(${face})`}>
          <circle cx={-110} cy={-30} r={26} fill="#cdd6f4" /><circle cx={110} cy={-30} r={26} fill="#cdd6f4" />
          <line x1={-90} y1={90} x2={90} y2={90} stroke="#cdd6f4" strokeWidth={18} strokeLinecap="round" />
        </g>
      ) : lines.map((_, i) => {
        const y = y0 + 100 + i * 40;
        if (i === hi && gone >= 1) return null;
        const red = state === "error" && (i * 7) % 12 < flood * 12;
        return (
          <g key={i} opacity={i === hi ? 1 - gone : 1}>
            {i === hi && <rect x={x0 + 8} y={y - 22} width={w - 16} height={36} fill="#45475a" />}
            <text x={x0 + 26} y={y + 6} fontFamily={MONO} fontSize={24} fill="#6c7086">{i + 1}</text>
            <rect x={x0 + 80 + ((i * 3) % 4) * 30} y={y - 8} width={140 + ((i * 97) % 330)} height={16} rx={6} fill={["#c084fc", "#89b4fa", "#f9e2af", "#a6e3a1", "#f5c2e7", "#94e2d5"][i % 6]} opacity={0.8} />
            {red && <path d={`M ${x0 + 80 + ((i * 3) % 4) * 30} ${y + 14} q 8 -8 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0`} fill="none" stroke="#f38ba8" strokeWidth={4} />}
            {i === hi && gone === 0 && Math.floor(f / 8) % 2 === 0 && <rect x={x0 + 80 + ((i * 3) % 4) * 30 + 140 + ((i * 97) % 330) + 6} y={y - 16} width={5} height={32} fill="#f5e0dc" />}
          </g>
        );
      })}
      {/* the problems bar */}
      <rect x={x0} y={y0 + h - 70} width={w} height={70} rx={20} fill="#181825" /><rect x={x0} y={y0 + h - 70} width={w} height={30} fill="#181825" />
      {state === "ok" ? (
        <text x={x0 + 40} y={y0 + h - 22} fontFamily={MONO} fontWeight={800} fontSize={36} fill="#4ade80">✓ SUCCESS · 0 errors</text>
      ) : (
        <g><circle cx={x0 + 52} cy={y0 + h - 34} r={18} fill={RED} /><text x={x0 + 52} y={y0 + h - 22} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={28} fill="#fff">!</text>
          <text x={x0 + 90} y={y0 + h - 22} fontFamily={MONO} fontWeight={800} fontSize={36} fill={errors > 1 ? "#f87171" : "#fca5a5"}>{errors} {errors === 1 ? "error" : "errors"}</text></g>
      )}
      {/* a few red error lines flood in */}
      {state === "error" && flood > 0 && [0, 1, 2, 3].map((i) => <text key={i} x={x0 + 480} y={y0 + h - 100 - i * 44} fontFamily={MONO} fontSize={26} fill="#f87171" opacity={Math.min(1, flood * 4 - i)}>{["TypeError: ???", "SyntaxError: why", "NameError: 'you'", "IndexError: life"][i]}</text>)}
    </g>
  );
};

const Smoke: React.FC<{ x: number; y: number; f: number; k: number }> = ({ x, y, f, k }) =>
  k <= 0 ? null : <g opacity={k}>{[0, 1, 2, 3].map((i) => { const t = ((f + i * 11) % 44) / 44; return <circle key={i} cx={x + Math.sin(t * 6 + i) * 18} cy={y - t * 150} r={14 + t * 26} fill="#9ca3af" opacity={0.7 * (1 - t)} />; })}</g>;

/* ---------- 1. Waking up at 11 a.m. ---------- */
export const IT1: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const up = tw(f, S(1) + 4, S(1) + 30);
  const stretch = pulse(f, S(3), 50);
  const lookPC = tw(f, S(4) - 10, S(4) + 6);
  const youPose = alive(mix(mix(P({ drop: 52, lL: [88, 4], lR: [84, 6], aL: [-20, -10], aR: [24, 14], lean: 4, tilt: 10 }), P({ drop: 52, lL: [88, 4], lR: [84, 6], aL: [-160, -175], aR: [160, 175], tilt: -6 }), stretch), P({ drop: 52, lL: [88, 4], lR: [84, 6], aL: [-14, -6], aR: [30, 20], lean: -4, tilt: -4 }), lookPC), f, 0.6);
  return (
    <g>
      <rect width={VW} height={VH} fill="#2a2f45" />
      {/* closed curtains, a line of noon sun between them */}
      <rect x={300} y={240} width={480} height={420} fill="#fde68a" />
      <rect x={300} y={240} width={480} height={420} fill="none" stroke={INK} strokeWidth={8} />
      <path d={`M 290 230 Q 360 450 300 680 L 548 680 Q 520 450 540 230 Z`} fill="#7f1d1d" stroke={INK} strokeWidth={6} />
      <path d={`M 790 230 Q 720 450 780 680 L 532 680 Q 560 450 540 230 Z`} fill="#991b1b" stroke={INK} strokeWidth={6} />
      <path d="M 540 680 L 470 1240 L 640 1240 Z" fill="#fde68a" opacity={0.12} />
      <rect x={270} y={220} width={540} height={20} rx={8} fill="#57534e" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#1f2335" />
      {/* bed */}
      <rect x={40} y={GY - 210} width={30} height={210} rx={8} fill="#8b6b4a" stroke={INK} strokeWidth={5} />
      <rect x={60} y={GY - 150} width={500} height={70} rx={14} fill="#e2e8f0" stroke={INK} strokeWidth={5} />
      <line x1={90} y1={GY - 80} x2={90} y2={GY} stroke={INK} strokeWidth={9} /><line x1={530} y1={GY - 80} x2={530} y2={GY} stroke={INK} strokeWidth={9} />
      <rect x={76} y={GY - 196} width={130} height={56} rx={24} fill="#f8fafc" stroke={INK} strokeWidth={5} />
      {up < 0.5 ? (
        <g>
          {/* a lump under the blanket, the head just out */}
          <path d={`M 150 ${GY - 150} Q 200 ${GY - 260 - Math.sin(f / 14) * 6} 360 ${GY - 230} Q 520 ${GY - 220} 550 ${GY - 150} Z`} fill="#6d8fb5" stroke={INK} strokeWidth={6} />
          <g transform={`translate(160 ${GY - 196}) rotate(-70)`}><circle r={44} fill="#fffdf8" stroke={INK} strokeWidth={9} /><path d="M -40 -14 L -44 -38 L -20 -34 L -14 -56 L 6 -40 L 22 -60 L 30 -38 L 44 -16 Q 0 -30 -40 -14 Z" fill={INK} /><path d="M -14 0 q 6 5 12 0 M 10 0 q 6 5 12 0" stroke={INK} strokeWidth={4} fill="none" /></g>
          {[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={240 + t * 50} y={GY - 300 - t * 90} fontFamily={HAND} fontSize={44 + t * 26} fill="#cbd5e1" opacity={1 - t}>z</text>; })}
        </g>
      ) : (
        <g>
          <Person who="you" x={420} y={GY - 4} pose={youPose} f={f} face={{ eyes: stretch > 0.3 ? "closed" : lookPC > 0.5 ? "tired" : "tired", mouth: stretch > 0.3 ? "o" : "flat", look: lookPC > 0.5 ? 0.9 : 0.3 }} />
          <path d={`M 300 ${GY - 150} Q 330 ${GY - 210} 470 ${GY - 196} Q 560 ${GY - 190} 560 ${GY - 150} Z`} fill="#6d8fb5" stroke={INK} strokeWidth={6} opacity={1} />
        </g>
      )}
      {/* desk with last night's laptop, still showing ERROR */}
      <Desk x={640} w={400} />
      <Laptop x={840} y={GY - 230} f={f} mode="error" s={0.9 + 0.12 * lookPC} />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${700 + i * 22} ${GY - 230})`}><rect x={-12} y={-46} width={24} height={46} rx={4} fill={["#a3e635", "#f472b6", "#38bdf8"][i]} stroke={INK} strokeWidth={3} /></g>)}
      {/* flashback: 4 a.m., the code didn't work */}
      <Bubble x={560} y={880} w={520} h={240} k={pop(f, S(2), 14) * (1 - tw(f, S(3) - 8, S(3)))} tail="left" thought>
        <text x={-130} y={-40} textAnchor="middle" fontFamily={HAND} fontSize={56} fill={INK}>4:00 AM</text>
        <path transform="translate(-130 30)" d="M 18 -40 A 40 40 0 1 0 40 20 A 30 30 0 1 1 18 -40 Z" fill="#fbbf24" stroke={INK} strokeWidth={4} />
        <g transform="translate(120 70) scale(0.62)"><Laptop x={0} y={0} f={f} mode="error" /></g>
      </Bubble>
      <PovTag f={f} />
      <Txt x={850} y={140} t="11:00 AM" size={84} color="#fff" outline={INK} />
      {f > S(4) && <Txt x={840} y={GY - 470} t="still." size={70} color="#f87171" outline={INK} k={pop(f, S(4) + 12, 12)} rot={-6} />}
    </g>
  );
};

/* ---------- 2. "Just one line" ---------- */
export const IT2: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const run = pulse(f, S(2) + 18, 12);
  const boom = f >= S(3);
  const errors = f < S(3) ? 1 : f < S(5) ? Math.round(tw(f, S(3), S(3) + 40, 1, 47)) : Math.round(tw(f, S(5), S(5) + 20, 47, 50));
  const gone = tw(f, S(4) + 10, S(4) + 30);
  const face = tw(f, S(7), S(7) + 14);
  const shrug = tw(f, S(8), S(8) + 12);
  const shake = boom && f < S(3) + 30 ? Math.sin(f * 2.4) * 8 : 0;
  const typingK = f < S(2) + 10 ? 1 : 0;
  const pose = alive(mix(mix(P({ ...SIT, ...typing(f, typingK) }), P({ ...SIT, aL: [-30, -60], aR: [40, 20], lean: 8, tilt: 6 }), tw(f, S(3), S(3) + 8)), P({ ...SIT, aL: [-70, -140], aR: [70, 140], tilt: 0 }), shrug), f, 0.6);
  return (
    <g>
      <rect width={VW} height={VH} fill="#e8edf5" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#c6cfdd" />
      <g transform={`translate(${shake} 0)`}>
        <Editor f={f} errors={errors} hi={5} gone={gone} run={run} state={boom ? "error" : "code"} flood={tw(f, S(3), S(3) + 40)} face={face} />
      </g>
      {f > S(3) && f < S(4) && <Txt x={540} y={480} t="1 → 47" size={150} color="#f87171" outline={INK} k={pop(f, S(3) + 30, 12)} rot={-4} />}
      {f > S(5) && f < S(6) && <Txt x={540} y={480} t="50?!" size={170} color="#f87171" outline={INK} k={pop(f, S(5) + 12, 12)} rot={4} />}
      <Stool x={300} />
      <Person who="you" x={300} y={GY} pose={pose} f={f} face={{ eyes: boom ? (f > S(6) ? "tired" : "wide") : "tired", mouth: shrug > 0.5 ? "flat" : boom ? "wavy" : "flat", brows: boom && shrug < 0.5 ? "worried" : "none", look: 0.7, sweat: boom && shrug < 0.5 }} />
      <Desk x={360} w={640} />
      <rect x={470} y={GY - 250} width={240} height={20} rx={6} fill="#475569" stroke={INK} strokeWidth={4} />
      <path d={`M 800 ${GY - 230} l 20 -26 l 70 0 l 20 26 Z`} fill="#94a3b8" stroke={INK} strokeWidth={4} />
      <Smoke x={300} y={GY - 400} f={f} k={tw(f, S(3) + 20, S(3) + 40) * (1 - shrug)} />
      {f > S(6) && f < S(7) + 4 && <Txt x={300} y={GY - 430} t="?" size={110} color={INK} k={pop(f, S(6) + 4, 12)} />}
      {f > S(8) && <Txt x={540} y={1000} t="fair." size={90} color={INK} k={pop(f, S(8) + 16, 12)} rot={-4} />}
    </g>
  );
};

/* ---------- 3. In class ---------- */
export const IT3: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const awake = tw(f, S(4), S(4) + 8);
  const nod = f > S(1) && f < S(4) ? Math.sin(f / 7) * 9 : 0;
  // the bars on the board sort themselves (a swap every 30 frames)
  const bars = [5, 2, 6, 1, 4, 3];
  const swaps = Math.min(8, Math.max(0, Math.floor((f - S(0)) / 30)));
  const arr = [...bars];
  let n = 0;
  outer: for (let i = 0; i < arr.length; i++) for (let j = 0; j < arr.length - 1 - i; j++) { if (n >= swaps) break outer; if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; n++; } }
  const teach = alive(P({ aR: [-150 + Math.sin(f / 9) * 8, -160], aL: [-14, -6], tilt: 4 }), f, 0.8);
  const point = alive(P({ aR: [-100, -96], aL: [-20, -10] }), f, 0.6);
  const tPose = f > S(3) - 4 ? mix(teach, point, tw(f, S(3) - 4, S(3) + 6)) : teach;
  const write = { aL: [48, 90] as [number, number], aR: [56, 94 + Math.sin(f * 2.6) * 12] as [number, number] };
  const you = alive(mix(P({ ...SIT, aL: [46, 88], aR: [52, 92], tilt: nod - 4, lean: 2 }), P({ ...SIT, ...write, tilt: -6, lean: -8, dy: -6 }), awake), f, 0.6);
  return (
    <g>
      <rect width={VW} height={VH} fill="#f3efe6" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#d6cdb8" />
      {/* the whiteboard */}
      <rect x={60} y={150} width={960} height={520} rx={14} fill="#fff" stroke={INK} strokeWidth={8} />
      <text x={110} y={225} fontFamily={HAND} fontSize={56} fill={RED}>Bubble Sort  O(n²)</text>
      {arr.map((v, i) => <rect key={v} x={110 + i * 60} y={600 - v * 50} width={44} height={v * 50} rx={6} fill={["#93c5fd", "#fca5a5", "#86efac", "#fde68a", "#c4b5fd", "#fdba74"][v - 1]} stroke={INK} strokeWidth={3} />)}
      <g stroke={INK} strokeWidth={4} fill="none" fontFamily={HAND} fontSize={30}>
        <rect x={560} y={250} width={180} height={60} rx={10} /><text x={650} y={290} textAnchor="middle" fill={INK} stroke="none">i = 0</text>
        <path d="M 650 310 L 650 350" /><path d="M 650 350 L 740 400 L 650 450 L 560 400 Z" /><text x={650} y={410} textAnchor="middle" fill={INK} stroke="none">a[j] &gt; a[j+1]?</text>
        <path d="M 740 400 L 830 400 L 830 480" /><rect x={760} y={480} width={150} height={56} rx={10} /><text x={835} y={518} textAnchor="middle" fill={INK} stroke="none">swap!</text>
        <path d="M 650 450 L 650 520" /><rect x={570} y={520} width={160} height={56} rx={10} /><text x={650} y={558} textAnchor="middle" fill={INK} stroke="none">j++</text>
        <path d="M 570 548 Q 500 548 500 400 Q 500 280 560 280" />
      </g>
      {/* the teacher with the red pen */}
      <Person who="teacher" x={880} y={GY} pose={tPose} f={f} flip face={{ eyes: "open", mouth: f > S(3) && f < S(4) ? (Math.floor(f / 5) % 2 ? "o" : "flat") : "flat", brows: "stern", look: 0.6 }} />
      <Stool x={250} />
      <Person who="you" x={250} y={GY} pose={you} f={f} face={{ eyes: awake > 0.5 ? "wide" : f > S(2) && f < S(3) ? "happy" : "tired", mouth: awake > 0.5 ? "wavy" : f > S(2) && f < S(3) ? "smile" : "flat", brows: awake > 0.5 ? "up" : "none", look: 0.7, sweat: awake > 0.5 }} />
      <Desk x={300} w={330} />
      <rect x={380} y={GY - 244} width={170} height={14} rx={3} fill="#fff" stroke={INK} strokeWidth={3} />
      {/* thinking about dinner */}
      <Bubble x={300} y={780} w={400} h={230} k={pop(f, S(2) + 4, 14) * (1 - tw(f, S(3) + 30, S(3) + 40))} tail="left" thought>
        <path d="M -110 -10 L 50 -10 Q 40 70 -30 70 Q -100 70 -110 -10 Z" fill="#fde68a" stroke={INK} strokeWidth={5} />
        <path d="M -100 -14 q 20 -26 40 0 q 20 -26 40 0 q 20 -26 40 0 q 20 -20 30 0" fill="none" stroke="#f59e0b" strokeWidth={5} />
        <line x1={0} y1={-70} x2={70} y2={-10} stroke="#92400e" strokeWidth={6} strokeLinecap="round" /><line x1={20} y1={-80} x2={84} y2={-16} stroke="#92400e" strokeWidth={6} strokeLinecap="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${-80 + i * 40} -40 q -10 -16 0 -32 q 10 -16 0 -32`} fill="none" stroke="#9ca3af" strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />)}
        <text x={120} y={40} textAnchor="middle" fontFamily={HAND} fontSize={48} fill={INK}>dinner?</text>
      </Bubble>
      <Bubble x={740} y={780} w={470} h={190} k={pop(f, S(3) + 2, 12)} tail="right">
        <text x={0} y={-12} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={INK}>"This will be</text>
        <text x={0} y={42} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={RED}>on the exam."</text>
      </Bubble>
      {awake > 0 && <g transform={`translate(250 ${GY - 470}) scale(${pop(f, S(4), 12)})`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={HAND} fontSize={120} fill={RED} stroke={INK} strokeWidth={6} paintOrder="stroke fill">!</text>
        {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 70} -70 l ${sd * 26} 20 l ${-sd * 14} 8 l ${sd * 26} 24`} fill="none" stroke="#f59e0b" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />)}
      </g>}
      <Txt x={540} y={110} t="2:00 PM · Class" size={76} color={INK} />
    </g>
  );
};

export { STAND };
