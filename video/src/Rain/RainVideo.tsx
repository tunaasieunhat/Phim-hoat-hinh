// "Rainy day: plan vs. reality" — 1080x1920 (9:16), 30 fps. Narrator (Andrew), Lily (Ava), Mom (Jenny), Max (Brian,
// over the phone). Subtitles: English on top, Vietnamese below, with the speaker's name. Remotion renders picture +
// voices + effects; rain and music (PLAN / REALITY) are mixed afterwards by scripts/mix_rain.py, ducked under the voices.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { Rain1, Rain2 } from "./scenes1";
import { RAIN_HOLD, Rain3, Rain4, Rain5, Rain6, Rain7, tearAt } from "./scenes2";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading Rain fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const FPS = 30;
const NAME_COLOR: Record<string, string> = { Lily: "#db2777", Mom: "#7c3aed", Max: "#2563eb" };
const COMPONENTS: React.FC<{ sc: SceneData }>[] = [Rain1, Rain2, Rain3, Rain4, Rain5, Rain6, Rain7];
const starts = SCENES.reduce<number[]>((a, s, i) => [...a, i === 0 ? 0 : a[i - 1] + SCENES[i - 1].frames], []);
export const RAIN_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0) + RAIN_HOLD;
export const RAIN_PREVIEW_FRAMES = SCENES.slice(0, 2).reduce((a, s) => a + s.frames, 0);

const fade = (t: number, t0: number, t1: number) => interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// English on top, Vietnamese below; each at most two lines, centred above the phone UI
const Name: React.FC<{ who: string; size: number }> = ({ who, size }) =>
  who === "Narrator" ? null : (
    <span style={{ fontSize: size * 0.62, color: "#fff", background: who.includes("&") ? "#dc2626" : NAME_COLOR[who] ?? "#475569", WebkitTextStroke: "0px", padding: "2px 14px", borderRadius: 999, marginRight: 12, verticalAlign: "middle", position: "relative", top: -4 }}>{who}</span>
  );
// a long sentence is shown in two halves (split at the comma nearest the middle), timed by its length
const half = (text: string, limit: number, prog: number) => {
  if (text.length <= limit) return text;
  const cuts = [...text.matchAll(/[,:;]\s/g)].map((m) => (m.index ?? 0) + 1);
  if (!cuts.length) return text;
  const c = cuts.reduce((a, b) => (Math.abs(b - text.length / 2) < Math.abs(a - text.length / 2) ? b : a));
  return prog < c / text.length ? text.slice(0, c).trim() : text.slice(c).trim();
};
const Subtitles: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const t = useCurrentFrame() / FPS;
  const ln = sc.lines.find((q, i) => t >= q.t0 && t < Math.min(q.t1 + 0.4, sc.lines[i + 1]?.t0 ?? 1e9));
  const common: React.CSSProperties = { position: "relative", maxWidth: 990, textAlign: "center", fontFamily: "MedSans", fontWeight: 700, paintOrder: "stroke fill", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
  if (!ln) return null;
  const end = Math.min(ln.t1 + 0.4, sc.lines[sc.lines.indexOf(ln) + 1]?.t0 ?? 1e9);
  const op = fade(t, ln.t0, end);
  const prog = (t - ln.t0) / Math.max(0.1, ln.t1 - ln.t0);
  const en = half(ln.en, 70, prog), vi = half(ln.vi, 78, prog);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1330, gap: 14 }}>
      <div style={{ position: "absolute", top: 1300, left: 40, right: 40, height: 320, borderRadius: 36, background: "rgba(15,23,42,0.55)", opacity: op }} />
      <div style={{ ...common, minHeight: 112, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ ...common, opacity: op, fontSize: en.length > 64 ? 42 : 46, color: "#fde68a", WebkitTextStroke: "2px #111827" }}><Name who={ln.who} size={46} />{en}</div>
      </div>
      <div style={{ ...common, opacity: op, fontSize: vi.length > 70 ? 42 : 48, color: "#fff", WebkitTextStroke: "2px #111" }}><Name who={ln.who} size={48} />{vi}</div>
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{ sc: SceneData; i: number; last: boolean; len: number }> = ({ sc, i, last, len }) => {
  const f = useCurrentFrame();
  const C = COMPONENTS[i];
  const dark = Math.max(interpolate(f, [0, i === 0 ? 12 : 7], [1, 0], { extrapolateRight: "clamp" }), interpolate(f, [len - (last ? 24 : 7), len], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><C sc={sc} /></svg>
      <Subtitles sc={sc} />
      <AbsoluteFill style={{ background: "#000", opacity: dark * 0.9 }} />
      <Audio src={staticFile(sc.audio)} />
    </AbsoluteFill>
  );
};

const Cue: React.FC<{ at: number; src: string; volume?: number; frames: number }> = ({ at, src, volume = 0.5, frames }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={frames} layout="none"><Audio src={staticFile(`audio/${src}`)} volume={volume} /></Sequence>
);
// absolute frame of a moment inside a scene (seconds)
export const at = (scene: number, sec: number) => starts[scene] + Math.round(sec * FPS);

export const RainVideo: React.FC<{ upto?: number }> = ({ upto = COMPONENTS.length }) => {
  const L = (scene: number, i: number) => SCENES[scene].lines[i].t0;
  const flashes = Array.from({ length: 15 }).map((_, k) => at(1, L(1, 0) + 1.5 + (k + 0.05) * (2.9 / 15)));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 1: curtains swish open, the cloud's thunder hello, a sparkle for the plan */}
      <Cue at={at(0, 0.6)} src="swipe2.wav" volume={0.5} frames={12} />
      <Cue at={at(0, L(0, 0) + 0.2)} src="thunder.ogg" volume={0.25} frames={60} />
      <Cue at={at(0, L(0, 1) + 0.2)} src="ding.mp3" volume={0.35} frames={30} />
      {/* 2: PLAN → REALITY "wah wah", the page, fifteen shutters, snores */}
      {upto > 1 && <>
        <Cue at={at(1, tearAt(SCENES[1]))} src="wahwah.wav" volume={0.55} frames={78} />
        <Cue at={at(1, L(1, 0) + 0.1)} src="page.ogg" volume={0.6} frames={24} />
        {flashes.map((t, k) => <Cue key={k} at={t} src="shutter.wav" volume={0.35} frames={10} />)}
        <Cue at={at(1, L(1, 2) + 1.6)} src="snore.wav" volume={0.5} frames={96} />
        <Cue at={at(1, L(1, 2) + 4.0)} src="snore.wav" volume={0.45} frames={60} />
      </>}
      {/* 3–5: the same "wah wah" when each PLAN rips */}
      {[2, 3, 4].filter((n) => n < upto).map((n) => <Cue key={`wah${n}`} at={at(n, tearAt(SCENES[n]))} src="wahwah.wav" volume={0.5} frames={78} />)}
      {upto > 2 && <>
        <Cue at={at(2, L(2, 1) - 0.4)} src="swipe2.wav" volume={0.4} frames={12} />
        <Cue at={at(2, L(2, 1) + 1.0)} src="bounce.flac" volume={0.3} frames={14} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Cue key={`tk${k}`} at={at(2, L(2, 1) + 0.2 + k * 0.32)} src="tick.wav" volume={0.3} frames={3} />)}
        <Cue at={at(2, L(2, 1) + 2.8)} src="snore.wav" volume={0.45} frames={96} />
      </>}
      {upto > 3 && <>
        <Cue at={at(3, 6.6)} src="page.ogg" volume={0.45} frames={24} />
        <Cue at={at(3, L(3, 0) - 0.7)} src="door-creak.ogg" volume={0.6} frames={26} />
        <Cue at={at(3, L(3, 2) + 1.9)} src="bruh.wav" volume={0.3} frames={50} />
      </>}
      {upto > 4 && <>
        {[0.3, 1.3].map((d, k) => <Cue key={`sl${k}`} at={at(4, L(4, 0) + d)} src="slurp.wav" volume={0.55} frames={33} />)}
        {[0.2, 1.2].map((d, k) => <Cue key={`sm${k}`} at={at(4, L(4, 1) + d)} src="slurp.wav" volume={0.6} frames={33} />)}
        <Cue at={at(4, L(4, 2) + 0.1)} src="ding.mp3" volume={0.35} frames={30} />
        <Cue at={at(4, L(4, 2) + 2.2)} src="crunch.wav" volume={0.35} frames={27} />
      </>}
      {upto > 5 && <>
        <Cue at={at(5, 0.2)} src="phone-ring.wav" volume={0.45} frames={30} />
        <Cue at={at(5, SCENES[5].lines[2].t1 + 0.9)} src="thunder.ogg" volume={0.7} frames={110} />
        <Cue at={at(5, SCENES[5].lines[2].t1 + 2.4)} src="swipe2.wav" volume={0.35} frames={12} />
      </>}
      {upto > 6 && <>
        {[0, 1, 2, 3].map((k) => <Cue key={`rp${k}`} at={at(6, L(6, 0) + 0.4 + k * 0.5)} src="tick.wav" volume={0.4} frames={4} />)}
        <Cue at={at(6, SCENES[6].lines[5].t1 + 0.2)} src="ding.mp3" volume={0.45} frames={30} />
      </>}
      {SCENES.slice(0, upto).map((sc, i) => (
        <Sequence key={sc.n} name={`Cảnh ${sc.n} · ${sc.title}`} from={starts[i]} durationInFrames={sc.frames + (i === 6 ? RAIN_HOLD : 0)}>
          <SceneFrame sc={sc} i={i} last={i === upto - 1} len={sc.frames + (i === 6 ? RAIN_HOLD : 0)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export const RainPreview: React.FC = () => <RainVideo upto={2} />;
export const RainFull: React.FC = () => <RainVideo />;
