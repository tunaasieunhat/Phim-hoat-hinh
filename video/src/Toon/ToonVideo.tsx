// Rainy-day toon (RicksClips-like): 1080×1920, 30 fps. Remotion renders picture + voices + SFX; rain and music
// are mixed afterwards by scripts/mix_toon.py (ducked under the voices, −14 LUFS).
// Captions: big white words with a black outline popping in word by word, centred; Vietnamese smaller underneath.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { cuts1, cuts2, Toon1, Toon2 } from "./scenes";
import { Toon3, Toon4 } from "./scenes3";
import { Toon5, Toon6, Toon7 } from "./scenes5";
import { useToonFonts } from "./Stills";

const FPS = 30;
const COMPONENTS: React.FC<{ sc: SceneData }>[] = [Toon1, Toon2, Toon3, Toon4, Toon5, Toon6, Toon7];
export const TOON_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);
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
  const C = (at: number, src: string, volume = 0.4, len = 1.5, key = `${src}${at}`) => <Cue key={key} at={at} src={src} volume={volume} len={len} />;
  const W = (...ts: number[]) => ts.map((x) => C(x - 0.06, "swipe.wav", 0.28, 0.8));
  const tearFx = (x: number) => [C(x - 0.05, "wahwah.wav", 0.5, 2.5), C(x + 0.45, "thud.ogg", 0.45, 1)];
  if (n === 3) return <>{[...W(2.4, 4.8, 7.0, 12.8, 16.9, 19.8), C(0.45, "drag.wav", 0.4, 1.3), ...Array.from({ length: 4 }).map((_, i) => C(2.45 + i * 0.54, "bounce.flac", 0.22, 0.5)), C(7.05, "charge.ogg", 0.35), ...tearFx(9.0),
    C(12.85, "drag.wav", 0.35, 2), C(14.9, "slide-whistle.wav", 0.35, 1.2), C(15.45, "thud.ogg", 0.45, 1), C(17.0, "tick.wav", 0.4, 2.4), C(18.3, "ding.mp3", 0.4), C(20.0, "snore.wav", 0.45, 3)]}</>;
  if (n === 4) return <>{[...W(2.4, 5.0, 7.2, 11.4, 13.6, 16.2, 19.7, 22.6, 24.8), C(1.0, "lock.ogg", 0.5, 1), C(2.5, "brush.wav", 0.4, 2.4), ...Array.from({ length: 8 }).map((_, i) => C(5.3 + i * 0.24, "ping.ogg", 0.16, 0.5)), C(7.25, "ding.mp3", 0.4), ...tearFx(9.0),
    C(12.2, "page.ogg", 0.5, 1), C(13.0, "page.ogg", 0.5, 1), C(13.7, "tick.wav", 0.4, 2.4), C(16.25, "door-creak.ogg", 0.45, 1.5), C(23.2, "bruh.wav", 0.4, 1.2), C(26.25, "boing.flac", 0.35, 1)]}</>;
  if (n === 5) return <>{[...W(2.4, 4.8, 7.0, 12.0, 15.2, 18.0, 20.8, 23.8), C(1.0, "page.ogg", 0.45, 1), ...Array.from({ length: 7 }).map((_, i) => C(2.62 + i * 0.28, "crunch.wav", 0.25, 0.4)), ...Array.from({ length: 7 }).map((_, i) => C(5.1 + i * 0.29, "ping.ogg", 0.15, 0.5)),
    C(7.05, "ding.mp3", 0.4), ...tearFx(9.0), C(9.7, "pour.wav", 0.45, 2.2), C(12.2, "slurp.wav", 0.45, 1.3), C(13.6, "slurp.wav", 0.45, 1.3), C(15.4, "crunch.wav", 0.35, 1), C(18.4, "thud.ogg", 0.5, 1), C(18.45, "boing.flac", 0.3, 1),
    ...Array.from({ length: 6 }).map((_, i) => C(21.0 + i * 0.4, "ping.ogg", 0.16, 0.5)), C(24.2, "gulp.wav", 0.4, 1)]}</>;
  if (n === 6) return <>{[...W(2.6, 5.6, 7.4, 9.0, 10.6, 14.0, 17.2, 19.8), C(0.05, "vibrate.wav", 0.45, 2.5), C(5.6, "birds.ogg", 0.35, 1.8), C(9.0, "birds.ogg", 0.35, 1.6), C(7.45, "boing.flac", 0.2, 0.6),
    C(14.1, "swipe2.wav", 0.5, 1.2), C(15.6, "thunder.ogg", 0.6, 3), C(15.8, "splash.ogg", 0.3, 1.5), C(18.6, "drag.wav", 0.3, 1)]}</>;
  if (n === 7) return <>{[...W(2.9, 6.0, 8.8, 12.6, 14.4, 16.6, 21.0, 24.0), ...Array.from({ length: 4 }).map((_, i) => C(3.4 + i * 0.4, "thud.ogg", 0.35, 0.8)), ...Array.from({ length: 4 }).map((_, i) => C(6.3 + i * 0.55, "ping.ogg", 0.25, 0.6)),
    C(21.6, "lock.ogg", 0.4, 0.8), C(24.2, "ding.mp3", 0.35, 1.5)]}</>;
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

export const ToonFull: React.FC = () => {
  useToonFonts();
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {SCENES.map((sc, i) => { const from = at; at += sc.frames; return <Sequence key={sc.n} from={from} durationInFrames={sc.frames}><SceneFrame sc={sc} i={i} /></Sequence>; })}
    </AbsoluteFill>
  );
};
