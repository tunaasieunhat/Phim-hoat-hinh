// Rainy-day toon (RicksClips-like): 1080×1920, 30 fps. Remotion renders picture + voices + SFX; rain and music
// are mixed afterwards by scripts/mix_toon.py (ducked under the voices, −14 LUFS).
// Captions: big white words with a black outline popping in word by word, centred; Vietnamese smaller underneath.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { cuts1, cuts2, Toon1, Toon2 } from "./scenes";
import { useToonFonts } from "./Stills";

const FPS = 30;
const COMPONENTS: React.FC<{ sc: SceneData }>[] = [Toon1, Toon2];
export const TOON_PREVIEW_FRAMES = SCENES.slice(0, 2).reduce((a, s) => a + s.frames, 0);

// group the spoken words into short punchy chunks (≤3 words, break after punctuation)
const chunks = (ln: SceneData["lines"][number]) => {
  const toks = ln.en.split(/\s+/);
  const ws = ln.words.map((w, i) => ({ ...w, text: toks.length === ln.words.length ? toks[i] : w.w }));
  const out: (typeof ws)[] = [];
  let cur: typeof ws = [];
  for (const w of ws) {
    cur.push(w);
    if (cur.length >= 3 || /[,.!?…]$/.test(w.text) || cur.map((c) => c.text).join(" ").length > 13) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};
const Captions: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const t = useCurrentFrame() / FPS;
  const ln = sc.lines.find((l, i) => t >= l.t0 - 0.02 && t < Math.min(l.t1 + 0.35, sc.lines[i + 1]?.t0 ?? 1e9));
  if (!ln) return null;
  const cs = chunks(ln);
  const ci = Math.max(0, cs.findIndex((c, i) => t < (cs[i + 1]?.[0].t0 ?? 1e9) - 0.02));
  const op = interpolate(t, [ln.t1 + 0.2, ln.t1 + 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stroke: React.CSSProperties = { WebkitTextStroke: "14px #111", paintOrder: "stroke fill" };
  return (
    <AbsoluteFill style={{ opacity: op, alignItems: "center", fontFamily: "ToonSans", fontWeight: 800 }}>
      <div style={{ position: "absolute", top: 1330, width: 1000, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 46px" }}>
        {cs[ci].map((w, i) => {
          const k = interpolate(t, [w.t0 - 0.02, w.t0 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <span key={i} style={{ ...stroke, fontSize: 104, lineHeight: 1.1, color: "#fff", opacity: k > 0 ? 1 : 0, transform: `scale(${1.15 - 0.15 * k}) translateY(${(1 - k) * 10}px)`, display: "inline-block", textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>{w.text}</span>;
        })}
      </div>
      <div style={{ position: "absolute", top: 1480, width: 980, textAlign: "center", fontSize: 50, lineHeight: 1.2, color: "#fff", WebkitTextStroke: "9px #111", paintOrder: "stroke fill" }}>{ln.vi}</div>
    </AbsoluteFill>
  );
};

const Cue: React.FC<{ at: number; src: string; volume?: number; len?: number }> = ({ at, src, volume = 0.5, len = 3 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(len * FPS)} layout="none"><Audio src={staticFile(`audio/${src}`)} volume={volume} /></Sequence>
);
const SFX: React.FC<{ n: number; sc: SceneData }> = ({ n, sc }) => {
  if (n === 1) {
    const c = cuts1(sc);
    return <>{[<Cue key="th" at={0.05} src="thunder.ogg" volume={0.55} len={3} />, <Cue key="w1" at={c.cB - 0.08} src="swipe.wav" volume={0.35} len={1} />, <Cue key="cu" at={c.cB + 0.18} src="swipe2.wav" volume={0.5} len={1} />,
      <Cue key="w2" at={c.cC - 0.08} src="swipe.wav" volume={0.35} len={1} />, <Cue key="pe" at={c.cC + 0.1} src="brush.wav" volume={0.45} len={1.5} />, <Cue key="di" at={c.cC + 1.68} src="ding.mp3" volume={0.4} len={1.5} />,
      <Cue key="ch" at={c.cD} src="charge.ogg" volume={0.35} len={1.5} />, <Cue key="pi" at={c.better - 0.05} src="ping.ogg" volume={0.35} len={1} />]}</>;
  }
  const c = cuts2(sc);
  return <>{[<Cue key="st" at={0.12} src="ding.mp3" volume={0.4} len={1.2} />, <Cue key="pg" at={0.9} src="page.ogg" volume={0.5} len={1} />, <Cue key="w3" at={c.cF - 0.06} src="swipe.wav" volume={0.3} len={1} />,
    <Cue key="sl" at={c.cF + 0.3} src="slurp.wav" volume={0.45} len={1.2} />, <Cue key="ww" at={c.tear - 0.05} src="wahwah.wav" volume={0.5} len={2.5} />, <Cue key="th" at={c.tear + 0.45} src="thud.ogg" volume={0.45} len={1} />,
    ...Array.from({ length: 15 }).map((_, i) => <Cue key={`sh${i}`} at={c.cH + 0.1 + i * 0.1} src="shutter.wav" volume={0.32} len={0.4} />),
    <Cue key="w4" at={c.cH2 - 0.06} src="swipe.wav" volume={0.3} len={1} />, <Cue key="po" at={c.cH2 + 0.95} src="ping.ogg" volume={0.35} len={1} />,
    <Cue key="sn1" at={c.cI + 0.4} src="snore.wav" volume={0.45} len={2.6} />, <Cue key="sn2" at={c.cI2 + 0.2} src="snore.wav" volume={0.5} len={2.6} />]}</>;
};

const SceneFrame: React.FC<{ sc: SceneData; i: number }> = ({ sc, i }) => {
  const C = COMPONENTS[i];
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><C sc={sc} /></svg>
      <Captions sc={sc} />
      <Audio src={staticFile(sc.audio)} />
      <SFX n={sc.n} sc={sc} />
    </AbsoluteFill>
  );
};

export const ToonPreview: React.FC = () => {
  useToonFonts();
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {SCENES.slice(0, 2).map((sc, i) => { const from = at; at += sc.frames; return <Sequence key={sc.n} from={from} durationInFrames={sc.frames}><SceneFrame sc={sc} i={i} /></Sequence>; })}
    </AbsoluteFill>
  );
};
