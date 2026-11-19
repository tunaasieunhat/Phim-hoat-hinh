// "6 Types of Students When Spending Money" — 1080×1920, 30 fps, ~2:39. Remotion renders picture + 7 voices + SFX;
// music by scene is mixed afterwards by scripts/mix_spend.py (ducked under the voices, dropped 1 s before each
// punchline, −14 LUFS). Subtitles follow video-nguoi-que: English on top (pale yellow), Vietnamese below (white,
// black outline), a small name tag when a character speaks.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { useToonFonts } from "../Toon/Stills";
import { Cue } from "../Toon/ToonVideo";
import { COLOR, type Who } from "./cast";
import { SCENES, type SceneData } from "./data";
import { E, S1, S2, S3, S4, T } from "./scenesA";
import { S5, S6, S7, S8 } from "./scenesB";

const COMPONENTS: React.FC<{ sc: SceneData }>[] = [S1, S2, S3, S4, S5, S6, S7, S8];
export const SPEND_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);

const Name: React.FC<{ who: string; size: number }> = ({ who, size }) => who === "Narrator" ? null : (
  <span style={{ fontSize: size * 0.6, color: "#fff", background: COLOR[who as Who] ?? "#475569", WebkitTextStroke: "0px", padding: "2px 14px", borderRadius: 999, marginRight: 12, verticalAlign: "middle", position: "relative", top: -4 }}>{who}</span>
);
const Subtitles: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const t = useCurrentFrame() / 30;
  const i = sc.lines.findIndex((q, k) => t >= q.t0 - 0.05 && t < Math.min(q.t1 + 0.4, sc.lines[k + 1]?.t0 ?? 1e9));
  if (i < 0) return null;
  const ln = sc.lines[i], end = Math.min(ln.t1 + 0.4, sc.lines[i + 1]?.t0 ?? 1e9);
  const op = interpolate(t, [ln.t0 - 0.05, ln.t0 + 0.07, end - 0.1, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const common: React.CSSProperties = { maxWidth: 990, textAlign: "center", fontFamily: "ToonSans", fontWeight: 800, paintOrder: "stroke fill", lineHeight: 1.22, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 1335, gap: 12, opacity: op }}>
      <div style={{ position: "absolute", top: 1300, left: 40, right: 40, height: 300, borderRadius: 36, background: "rgba(15,23,42,0.55)" }} />
      <div style={{ ...common, fontSize: ln.en.length > 44 ? 46 : 52, color: "#fde68a", WebkitTextStroke: "2px #111827", position: "relative" }}><Name who={ln.who} size={52} />{ln.en}</div>
      <div style={{ ...common, fontSize: ln.vi.length > 48 ? 44 : 50, color: "#fff", WebkitTextStroke: "2px #000", position: "relative" }}><Name who={ln.who} size={50} />{ln.vi}</div>
    </AbsoluteFill>
  );
};

const SFX: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const C = (at: number, src: string, volume = 0.4, len = 1.5) => <Cue key={`${src}${at}`} at={at} src={src} volume={volume} len={len} />;
  const W = (...ts: number[]) => ts.map((x) => C(x - 0.06, "swipe.wav", 0.24, 0.8));
  const n = sc.n, t = (i: number) => T(sc, i), e = (i: number) => E(sc, i);
  const L: React.ReactNode[] = [];
  if (n === 1) L.push(...W(3.4, 6.4, t(4) - 0.1), ...[0, 1, 2, 3, 4, 5].map((i) => C(3.9 + i * 0.27, "kaching.wav", 0.32, 1)), C(6.6, "boing.flac", 0.35, 1), C(e(4) - 0.2, "bonk.ogg", 0.3, 0.6));
  if (n === 2) L.push(...W(2.9, 5.9, t(2) - 0.1, t(3) - 0.2, t(3) + 1.1, t(4) - 0.25), C(t(1), "cheer.wav", 0.5, 3), ...[0, 1, 2, 3, 4].map((i) => C(5.95 + i * 0.4, "swipe2.wav", 0.28, 0.8)), C(t(3) - 0.2, "page.ogg", 0.4, 1.2), C(t(3) + 1.3, "slurp.wav", 0.4, 1.3), C(t(4) - 0.2, "page.ogg", 0.4, 0.8));
  if (n === 3) L.push(C(0.2, "taps.wav", 0.4, 2.4), C(3.4, "taps.wav", 0.4, 2.4), ...W(3.4, e(1) + 0.15, t(2) - 0.2, t(3) - 0.2, t(4) - 0.2, t(5) - 0.3), C(e(1) + 0.3, "page.ogg", 0.4, 1), C(e(1) + 1.05, "doorbell.wav", 0.5, 1.8), C(e(1) + 1.3, "thud.ogg", 0.4, 1), C(t(5) - 0.3, "groan.wav", 0.3, 1.2));
  if (n === 4) L.push(...W(2.0, e(1) + 0.3, t(3) - 0.2, t(4) - 0.2), C(0.6, "kaching.wav", 0.35, 1), C(1.4, "kaching.wav", 0.35, 1), C(e(1) + 0.4, "crickets.wav", 0.45, 2.4), C(t(4) + 0.7, "shutter.wav", 0.45, 0.6));
  if (n === 5) L.push(...[0, 1, 2, 3].map((i) => C(0.45 + i * 0.6, "ping.ogg", 0.2, 0.5)), ...W(3.0, e(1) + 0.2, t(2) - 0.1, t(3) + 0.9, t(4) - 0.15), C(e(1) + 0.3, "page.ogg", 0.4, 1.4), C(t(2) + 0.3, "brush.wav", 0.35, 0.8), C(t(4) + 0.05, "thud.ogg", 0.55, 1.2));
  if (n === 6) L.push(C(0.5, "knock.wav", 0.5, 1), ...W(2.2, t(1) - 0.1, e(2) + 0.25, t(3) - 0.1, t(4) - 0.2), C(2.4, "rattle.wav", 0.4, 1.6), C(t(1), "rattle.wav", 0.4, 1.6), C(e(2) + 0.3, "rattle.wav", 0.45, 1.6), C(t(3) + 0.1, "kaching.wav", 0.35, 1), C(t(4) + 1.4, "shutter.wav", 0.45, 0.6));
  if (n === 7) L.push(...W(3.0, e(2) + 0.05, t(4) - 0.6, t(5) - 0.2, t(6) - 0.2), C(e(2) + 0.5, "bus.wav", 0.55, 2.6), C(t(5) - 0.1, "snore.wav", 0.35, 2.4), C(t(6) + 0.1, "thud.ogg", 0.45, 1));
  if (n === 8) L.push(...W(t(2) - 1.0, t(3) + 0.5, e(3) + 0.4, t(4) - 0.3, e(4) + 0.5), C(t(2) - 0.9, "slurp.wav", 0.4, 1.3), C(t(3) + 0.6, "ding.mp3", 0.3), ...[0, 1, 2, 3].map((i) => C(e(3) + 0.5 + i * 0.4, "ping.ogg", 0.25, 0.6)), C(e(4) + 0.7, "ding.mp3", 0.35, 1.5));
  return <>{L}</>;
};

const SceneFrame: React.FC<{ sc: SceneData; i: number }> = ({ sc, i }) => {
  const C = COMPONENTS[i];
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><C sc={sc} /></svg>
      <Subtitles sc={sc} />
      <Audio src={staticFile(sc.audio)} />
      <SFX sc={sc} />
    </AbsoluteFill>
  );
};
export const SpendFull: React.FC = () => {
  useToonFonts();
  let at = 0;
  return <AbsoluteFill style={{ background: "#111" }}>{SCENES.map((sc, i) => { const from = at; at += sc.frames; return <Sequence key={sc.n} from={from} durationInFrames={sc.frames}><SceneFrame sc={sc} i={i} /></Sequence>; })}</AbsoluteFill>;
};
