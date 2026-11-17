// "What Happens If You Don't Get Enough Sleep?" — narrated version, 1080x1920 (9:16), 30 fps.
// Deadpan "documentary" narration (Edge TTS en-US-AndrewNeural; Tom's "Yes, chicken." is en-US-GuyNeural).
// Subtitles: English on top (pale yellow), Vietnamese below (white). Remotion renders picture + narration + effects;
// the music bed is added afterwards by scripts/mix_tom.py (ffmpeg: punchline mutes, sidechain ducking, -14 LUFS).
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { Tom1, Tom2, Tom3, type SP } from "./scenes1";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading Tom fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const FPS = 30;
const COMPONENTS: React.FC<SP>[] = [Tom1, Tom2, Tom3];
const starts = SCENES.reduce<number[]>((a, s, i) => [...a, i === 0 ? 0 : a[i - 1] + SCENES[i - 1].frames], []);
export const TOM_PREVIEW_FRAMES = SCENES.slice(0, 3).reduce((a, s) => a + s.frames, 0);

const fade = (t: number, t0: number, t1: number) => interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Subtitles: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const t = useCurrentFrame() / FPS;
  const en = sc.sentences.find((q) => t >= q.t0 && t < q.t1 + 0.45);
  const vi = sc.cues.find((q) => t >= q.t0 && t < q.t1);
  const common: React.CSSProperties = { position: "relative", maxWidth: 960, textAlign: "center", fontFamily: "MedSans", fontWeight: 700, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
  const op = Math.max(en ? fade(t, en.t0, en.t1 + 0.45) : 0, vi ? fade(t, vi.t0, vi.t1) : 0);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1330, gap: 14 }}>
      <div style={{ position: "absolute", top: 1300, left: 40, right: 40, height: 320, borderRadius: 36, background: "rgba(15,23,42,0.6)", opacity: op }} />
      <div style={{ ...common, minHeight: 116, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {en && <div style={{ ...common, opacity: fade(t, en.t0, en.t1 + 0.45), fontSize: 48, color: "#fde68a", WebkitTextStroke: "2px #111827", paintOrder: "stroke fill" }}>{en.en}</div>}
      </div>
      {vi && <div style={{ ...common, opacity: fade(t, vi.t0, vi.t1), fontSize: 50, color: "#fff", WebkitTextStroke: "2px #000", paintOrder: "stroke fill" }}>{vi.vi}</div>}
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{ sc: SceneData; i: number; last: boolean }> = ({ sc, i, last }) => {
  const f = useCurrentFrame();
  const C = COMPONENTS[i];
  const dark = Math.max(interpolate(f, [0, i === 0 ? 12 : 7], [1, 0], { extrapolateRight: "clamp" }), interpolate(f, [sc.frames - (last ? 20 : 7), sc.frames], [0, 1], { extrapolateLeft: "clamp" }));
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

export const TomVideo: React.FC<{ upto?: number }> = ({ upto = COMPONENTS.length }) => {
  const F = (scene: number, i: number, end = false) => starts[scene] + Math.round((end ? SCENES[scene].sentences[i].t1 : SCENES[scene].sentences[i].t0) * FPS);
  const ff0 = F(0, 1, true) - 20, ff1 = F(0, 2) + 4;
  const ticks: number[] = [];
  for (let t = ff0, gap = 9; t < ff1 - 2; t += gap, gap = Math.max(3, gap * 0.9)) ticks.push(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 1: swipes, the night ticking past faster and faster, a ding at 3:47 */}
      {[30, 62, 150, 185].map((t) => <Cue key={`sw${t}`} at={t} src="swipe.wav" volume={0.25} frames={10} />)}
      {ticks.map((t, i) => <Cue key={`tk${i}`} at={t} src="tick.wav" volume={0.3} frames={3} />)}
      <Cue at={ff1} src="ding.mp3" volume={0.5} frames={30} />
      <Cue at={F(0, 3) + 12} src="bounce.flac" volume={0.3} frames={14} />
      {/* 2: the alarm, a zombie groan, the CLOSED sign dropping */}
      {upto > 1 && <>
        <Cue at={starts[1] + 8} src="alarm.wav" volume={0.4} frames={F(1, 1) - starts[1] - 22} />
        <Cue at={F(1, 1) - 14} src="thud.ogg" volume={0.5} frames={16} />
        <Cue at={F(1, 1, true) + 4} src="groan.wav" volume={0.35} frames={40} />
        <Cue at={F(1, 2) + 6} src="bounce.flac" volume={0.3} frames={14} />
        <Cue at={F(1, 3) + 42} src="boing.flac" volume={0.35} frames={30} />
      </>}
      {/* 3: "loading" music while Tom searches, drawer junk, the ding when the keys are found */}
      {upto > 2 && <>
        <Sequence from={F(2, 0) + 15} durationInFrames={F(2, 2) - F(2, 0) - 30} layout="none"><Audio src={staticFile("audio/music-loading.mp3")} volume={(f) => 0.22 * Math.min(1, f / 10)} /></Sequence>
        <Cue at={F(2, 1) + 10} src="swipe2.wav" volume={0.4} frames={10} />
        <Cue at={F(2, 1) + 22} src="pour.wav" volume={0.25} frames={30} />
        <Cue at={F(2, 2) + 4} src="ding.mp3" volume={0.7} frames={30} />
      </>}
      {SCENES.slice(0, upto).map((sc, i) => (
        <Sequence key={sc.n} name={`Cảnh ${sc.n} · ${sc.title}`} from={starts[i]} durationInFrames={sc.frames}>
          <SceneFrame sc={sc} i={i} last={i === upto - 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export const TomPreview: React.FC = () => <TomVideo upto={3} />;
