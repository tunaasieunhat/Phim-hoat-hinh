// "5 Types of Teams" — 1080x1920 (9:16), 30 fps. A narrator (en-US-AndrewNeural) and fifteen characters, each with
// their own Edge TTS voice. Subtitles: English on top (pale yellow), Vietnamese below (white), with the speaker's name.
// Scene lengths and line times come from src/Teams/data.ts (scripts/dialogue_narration.py); music/effects from
// scripts/make_teams_music.py.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { T1, T2, T3, T4, T5, T6, T7 } from "./scenes";
import { CAST } from "./people";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading Teams fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const FPS = 30;
const END_HOLD = 90; // the final card holds three more seconds
const COMPONENTS = [T1, T2, T3, T4, T5, T6, T7] as React.FC<{ sc: SceneData; hold: number }>[];
export const TEAMS_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0) + END_HOLD;

const fade = (t: number, t0: number, t1: number) => interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// English on top, Vietnamese below; each at most two lines, centred above the phone UI
const Name: React.FC<{ who: string; size: number }> = ({ who, size }) =>
  who === "Narrator" ? null : (
    <span style={{ fontSize: size * 0.62, color: "#fff", background: who.includes("&") ? "#dc2626" : CAST[who]?.cardigan ?? "#475569", WebkitTextStroke: "0px", padding: "2px 14px", borderRadius: 999, marginRight: 12, verticalAlign: "middle", position: "relative", top: -4 }}>{who}</span>
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

const SceneFrame: React.FC<{ sc: SceneData; i: number; len: number }> = ({ sc, i, len }) => {
  const f = useCurrentFrame();
  const C = COMPONENTS[i];
  const last = i === COMPONENTS.length - 1;
  const fadeIn = interpolate(f, [0, i === 0 ? 16 : 8], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = last ? interpolate(f, [len - 36, len], [0, 1], { extrapolateLeft: "clamp" }) : interpolate(f, [len - 8, len], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <C sc={sc} hold={last ? 1 : 0} />
      </svg>
      <Subtitles sc={sc} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fadeIn * (i === 0 ? 1 : 0.85), fadeOut * (last ? 1 : 0.85)) }} />
      <Audio src={staticFile(sc.audio)} />
    </AbsoluteFill>
  );
};

const Cue: React.FC<{ at: number; src: string; volume: number; frames: number }> = ({ at, src, volume, frames }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={frames} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);

export const TeamsVideo: React.FC = () => {
  const starts: number[] = [];
  let at = 0;
  SCENES.forEach((s) => { starts.push(at); at += s.frames; });
  const F = (scene: number, sec: number) => starts[scene] + Math.round(sec * FPS);
  const line = (scene: number, text: string) => SCENES[scene].lines.find((l) => l.en.includes(text))!;
  const jump = SCENES[3].marks[0]?.t ?? 7;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("teams/music.wav")} volume={0.14} />
      {/* effects from the production notes: a "ting" for each team sign, the calendar flips and the siren (4), laughter (5) */}
      {[1, 2, 3, 4, 5].map((i) => <Cue key={i} at={starts[i] + 8} src="teams/sfx/ting.wav" volume={0.45} frames={30} />)}
      {[1, 2, 3].map((d) => <Cue key={d} at={F(3, (jump * d) / 4)} src="teams/sfx/page-flip.ogg" volume={0.7} frames={24} />)}
      <Cue at={F(3, jump - 0.2)} src="teams/sfx/siren.wav" volume={0.3} frames={78} />
      <Cue at={F(4, line(4, "funny video").t1 + 0.2)} src="teams/sfx/laugh.wav" volume={0.55} frames={78} />
      <Cue at={F(4, line(4, "But hey").t1 + 0.1)} src="teams/sfx/laugh.wav" volume={0.5} frames={78} />
      {SCENES.map((sc, i) => {
        const len = sc.frames + (i === SCENES.length - 1 ? END_HOLD : 0);
        return (
          <Sequence key={sc.n} name={`Cảnh ${sc.n} · ${sc.title}`} from={starts[i]} durationInFrames={len}>
            <SceneFrame sc={sc} i={i} len={len} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
