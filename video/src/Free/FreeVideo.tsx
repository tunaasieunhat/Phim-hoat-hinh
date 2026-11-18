// "What if everything you bought was free?" — 1080×1920, 30 fps, ~2:29. Remotion renders picture + voices + SFX;
// music (by scene) is mixed afterwards by scripts/mix_free.py, ducked under the voice and normalized to −14 LUFS.
// Captions reuse the toon style: big white words popping in word by word, Vietnamese sentence underneath.
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { useToonFonts } from "../Toon/Stills";
import { Captions, Cue } from "../Toon/ToonVideo";
import { SCENES, type SceneData } from "./data";
import { END, Free1, Free2, Free3, T } from "./scenes1";
import { Free4, Free5, Free6, Free7 } from "./scenes4";

const COMPONENTS: React.FC<{ sc: SceneData }>[] = [Free1, Free2, Free3, Free4, Free5, Free6, Free7];
export const FREE_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);

const SFX: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const C = (at: number, src: string, volume = 0.4, len = 1.5) => <Cue key={`${src}${at}`} at={at} src={src} volume={volume} len={len} />;
  const W = (...ts: number[]) => ts.map((x) => C(x - 0.06, "swipe.wav", 0.26, 0.8));
  const n = sc.n, t = (i: number) => T(sc, i);
  const list: React.ReactNode[] = [];
  if (n === 1) list.push(C(0.2, "fanfare.wav", 0.55, 2.2), ...W(2.4, t(1) - 0.1, t(2) - 0.3, t(3) - 0.1, t(4) - 0.15), C(t(1), "swipe2.wav", 0.4, 1.2), C(t(2) - 0.05, "bonk.ogg", 0.4, 0.8), C(t(3) - 0.05, "bonk2.ogg", 0.4, 0.8), C(t(4), "charge.ogg", 0.35), C(t(4) + 0.3, "ding.mp3", 0.35));
  if (n === 2) list.push(C(0.6, "swipe2.wav", 0.45, 1.2), C(1.8, "thud.ogg", 0.45, 1), C(2.7, "swipe2.wav", 0.35, 1.2), ...[1, 2, 3, 4].map((i) => C(t(i) - 0.05, "kaching.wav", 0.5, 1.2)),
    ...W(t(4) + 1.1, t(5) - 0.2, t(6) - 0.1, t(6) + 3.3), C(t(4) + 1.2, "drag.wav", 0.4, 2), C(t(5) + 0.1, "bonk.ogg", 0.4, 0.6), C(t(5) + 0.5, "bonk2.ogg", 0.4, 0.6), C(t(5) + 0.9, "bonk.ogg", 0.4, 0.6), C(t(6) + 3.5, "crunch.wav", 0.35, 2));
  if (n === 3) list.push(...W(t(1) - 0.2, t(1) + 2.7, t(2) + 1.4, t(3) - 0.15, t(4) - 0.1), C(t(1) - 0.2, "crowd.wav", 0.55, 4.2), C(t(1) + 2.7, "crowd.wav", 0.6, 4.2), C(t(1) + 3.0, "boing.flac", 0.4, 1), C(t(2), "tick.wav", 0.35, 2), C(t(4) + 1.3, "boing.flac", 0.35, 1));
  if (n === 4) list.push(C(0.1, "tick.wav", 0.35, 3), ...W(t(1) - 0.2, t(2) - 0.25, t(3) - 0.25, t(4) - 0.25, t(4) + 1.95, t(5) - 0.1), C(t(1) + 1.5, "alarm.wav", 0.35, 0.8), C(t(2), "snore.wav", 0.4, 2.6), C(t(3), "snore.wav", 0.35, 2.6), C(t(4) + 2.1, "splash.ogg", 0.35, 1.5), C(t(5) + 0.4, "snore.wav", 0.4, 3));
  if (n === 5) list.push(...[0.3, 0.8, 1.3].map((x) => C(x, "page.ogg", 0.4, 0.8)), ...W(t(0), t(1) - 0.2, t(2) - 0.2, t(3) - 0.15, t(4) - 0.25, t(4) + 4.15), C(t(0) + 0.3, "door-creak.ogg", 0.4, 1.5), C(t(0) + 1.3, "groan.wav", 0.45, 1.5),
    C(t(2), "crickets.wav", 0.45, 2.2), ...[0, 1, 2, 3, 4].map((i) => C(t(4) + 0.2 + i * (END(sc) - t(4)) / 5.3, "crunch.wav", 0.3, 0.6)));
  if (n === 6) list.push(C(2.0, "brush.wav", 0.35, 1.3), ...W(t(1) - 0.35, t(2) - 0.6, t(3) - 0.4, t(3) + 3.2), C(t(1) + 0.05, "ding.mp3", 0.3), C(t(2) + 2.1, "ding.mp3", 0.45, 1.5), C(t(3) + 0.6, "drag.wav", 0.3, 0.8), C(t(3) + 1.2, "thud.ogg", 0.5, 1), C(t(3) + 1.25, "powerdown.wav", 0.35, 1.5));
  if (n === 7) list.push(...W(t(1) - 0.25, t(2) - 0.4, t(3) - 0.2, t(5) - 0.35, t(6) - 0.15, t(6) + 3.6), C(t(2) + 0.1, "lock.ogg", 0.4, 0.8), C(t(2) + 0.2, "kaching.wav", 0.45, 1.2), C(t(3), "drag.wav", 0.4, 2.4), C(t(6) + 0.25, "ping.ogg", 0.35, 1), C(t(6) + 3.8, "ding.mp3", 0.35, 1.5));
  return <>{list}</>;
};

const SceneFrame: React.FC<{ sc: SceneData; i: number }> = ({ sc, i }) => {
  const C = COMPONENTS[i];
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><C sc={sc} /></svg>
      <Captions sc={sc} />
      <Audio src={staticFile(sc.audio)} />
      <SFX sc={sc} />
    </AbsoluteFill>
  );
};
export const FreeFull: React.FC = () => {
  useToonFonts();
  let at = 0;
  return <AbsoluteFill style={{ background: "#111" }}>{SCENES.map((sc, i) => { const from = at; at += sc.frames; return <Sequence key={sc.n} from={from} durationInFrames={sc.frames}><SceneFrame sc={sc} i={i} /></Sequence>; })}</AbsoluteFill>;
};
