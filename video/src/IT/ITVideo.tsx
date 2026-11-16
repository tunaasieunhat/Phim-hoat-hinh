// "POV: A Day in the Life of an IT Student" — 1080x1920 (9:16), 30 fps. English narration (Edge TTS
// en-US-BrianNeural, deadpan); English subtitles on top (pale yellow), Vietnamese below (white, black outline).
// Scene lengths and subtitle times come from src/IT/data.ts (KIDS_VARIANT=it python3 scripts/kids_narration.py);
// music and effects from scripts/make_it_music.py.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { IT1, IT2, IT3 } from "./scenes";
import { IT4, IT5, IT6 } from "./scenes2";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading IT fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const FPS = 30;
const END_HOLD = 90; // the final card holds three more seconds
const COMPONENTS = [IT1, IT2, IT3, IT4, IT5, IT6] as React.FC<{ sc: SceneData; hold: number }>[];
export const IT_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0) + END_HOLD;

const fade = (t: number, t0: number, t1: number) => interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// English on top, Vietnamese below; each at most two lines, centred above the phone UI
const Subtitles: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const t = useCurrentFrame() / FPS;
  const en = sc.sentences.find((q) => t >= q.t0 && t < q.t1 + 0.45);
  const vi = sc.cues.find((q) => t >= q.t0 && t < q.t1);
  const common: React.CSSProperties = { position: "relative", maxWidth: 900, textAlign: "center", fontFamily: "MedSans", fontWeight: 700, paintOrder: "stroke fill", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1330, gap: 14 }}>
      {/* a soft dark band keeps both lines readable on the light scenes */}
      {(en || vi) && <div style={{ position: "absolute", top: 1300, left: 40, right: 40, height: 320, borderRadius: 36, background: "rgba(15,23,42,0.55)" }} />}
      <div style={{ ...common, minHeight: 112, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {en && <div style={{ ...common, opacity: fade(t, en.t0, en.t1 + 0.45), fontSize: 44, color: "#fde68a", WebkitTextStroke: "2px #111827" }}>{en.en}</div>}
      </div>
      {vi && <div style={{ ...common, opacity: fade(t, vi.t0, vi.t1), fontSize: 48, color: "#fff", WebkitTextStroke: "2px #111" }}>{vi.vi}</div>}
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

export const ITVideo: React.FC = () => {
  const starts: number[] = [];
  let at = 0;
  SCENES.forEach((s) => { starts.push(at); at += s.frames; });
  const S = (scene: number, i: number) => starts[scene] + Math.round(SCENES[scene].sentences[i].t0 * FPS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("it/music.wav")} volume={0.16} />
      {/* effects from the production notes: error (2), crickets when nobody replies (4), fireworks (5), the printer (6) */}
      <Cue at={S(1, 3)} src="it/sfx/error.wav" volume={0.5} frames={40} />
      <Cue at={S(1, 5) + 10} src="it/sfx/error.wav" volume={0.5} frames={40} />
      <Cue at={S(3, 4)} src="it/sfx/crickets.wav" volume={0.45} frames={120} />
      <Cue at={S(4, 3)} src="it/sfx/fireworks.wav" volume={0.5} frames={100} />
      <Cue at={S(5, 4) + 6} src="it/sfx/printer.wav" volume={0.4} frames={90} />
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
