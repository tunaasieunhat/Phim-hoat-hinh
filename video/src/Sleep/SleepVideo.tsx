// "What Happens If You Don't Get Enough Sleep?" — 1080x1920 (9:16), 30 fps, no narration.
// The story is told with action, faces, short bilingual labels (EN top, VI below), sound effects and music,
// all from public/audio (see public/audio/CREDITS.md). Scenes are added to SCENES as they are built.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SC1, SC1_LEN, SC2, SC2_LEN, SC3, SC3_LEN, Sleep1, Sleep2, Sleep3 } from "./scenes1";
import { SC4, SC4_LEN, SC5, SC5_LEN, SC6, SC6_LEN, Sleep4, Sleep5, Sleep6 } from "./scenes2";
import { SC7, SC7_LEN, SC8, SC8_LEN, SC9, SC9_LEN, Sleep7, Sleep8, Sleep9 } from "./scenes3";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading Sleep fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("MedSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const SCENES: { C: React.FC; len: number }[] = [
  { C: Sleep1, len: SC1_LEN },
  { C: Sleep2, len: SC2_LEN },
  { C: Sleep3, len: SC3_LEN },
  { C: Sleep4, len: SC4_LEN },
  { C: Sleep5, len: SC5_LEN },
  { C: Sleep6, len: SC6_LEN },
  { C: Sleep7, len: SC7_LEN },
  { C: Sleep8, len: SC8_LEN },
  { C: Sleep9, len: SC9_LEN },
];
const starts = SCENES.reduce<number[]>((a, s, i) => [...a, i === 0 ? 0 : a[i - 1] + SCENES[i - 1].len], []);
export const SLEEP_FRAMES = SCENES.reduce((a, s) => a + s.len, 0);
export const SLEEP_PREVIEW_FRAMES = SCENES.slice(0, 3).reduce((a, s) => a + s.len, 0);

const Cue: React.FC<{ at: number; src: string; volume?: number; frames: number }> = ({ at, src, volume = 0.6, frames }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={frames} layout="none"><Audio src={staticFile(`audio/${src}`)} volume={volume} /></Sequence>
);

const SceneFrame: React.FC<{ C: React.FC; len: number; first: boolean; last: boolean }> = ({ C, len, first, last }) => {
  const f = useCurrentFrame();
  const dark = Math.max(interpolate(f, [0, first ? 12 : 7], [1, 0], { extrapolateRight: "clamp" }), interpolate(f, [len - (last ? 20 : 7), len], [0, 1], { extrapolateLeft: "clamp" }));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><C /></svg>
      <AbsoluteFill style={{ background: "#000", opacity: dark * 0.9 }} />
    </AbsoluteFill>
  );
};

// effects at their gag moments (frames are absolute)
const Effects: React.FC = () => {
  const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = starts;
  const swipes: number[] = [];
  for (let t = 24, gap = 34; t < SC1.ding - 6; t += gap, gap = Math.max(9, gap * 0.93)) swipes.push(t);
  const ticks: number[] = [];
  for (let t = 0, gap = 30; t < SC1.ding; t += gap, gap = Math.max(6, gap * 0.95)) ticks.push(t);
  return (
    <>
      {/* 1: swipes and ticks speeding up, the bed's bounce, the ding at 03:47 */}
      {swipes.map((t, i) => <Cue key={`sw${i}`} at={s1 + t} src={i % 2 ? "swipe2.wav" : "swipe.wav"} volume={0.4} frames={10} />)}
      {ticks.map((t, i) => <Cue key={`tk${i}`} at={s1 + t} src="tick.wav" volume={0.3} frames={4} />)}
      {SC1.beg.map(([a], i) => <Cue key={`bg${i}`} at={s1 + a + 4} src="bounce.flac" volume={0.45} frames={14} />)}
      <Cue at={s1 + SC1.ding} src="ding.mp3" volume={0.8} frames={30} />
      {/* 2: the alarm, the zombie groans, the bed scraping along */}
      <Cue at={s2} src="alarm.wav" volume={0.55} frames={SC2.slap} />
      <Cue at={s2 + SC2.slap - 4} src="boing.flac" volume={0.35} frames={18} />
      {SC2.groans.map((t) => <Cue key={`gr${t}`} at={s2 + t} src="groan.wav" volume={0.7} frames={72} />)}
      {[0, 88, 176].map((d) => <Cue key={`dr${d}`} at={s2 + SC2.walk0 + d} src="drag.wav" volume={0.45} frames={90} />)}
      {/* 3: brushing, the "loading" music, the "bruh" */}
      <Cue at={s3 + SC3.paste} src="swipe2.wav" volume={0.3} frames={10} />
      <Cue at={s3 + SC3.brush0} src="brush.wav" volume={0.6} frames={90} />
      <Cue at={s3 + SC3.brush0 + 90} src="brush.wav" volume={0.6} frames={SC3.brush1 - SC3.brush0 - 90} />
      <Sequence from={s3 + SC3.load} durationInFrames={SC3.realize - SC3.load} layout="none"><Audio src={staticFile("audio/music-loading.mp3")} volume={(f) => 0.4 * Math.min(1, f / 8)} /></Sequence>
      <Cue at={s3 + SC3.realize} src="bruh.wav" volume={0.8} frames={60} />
      {/* 4: cereal into the glass, coffee into the bowl, face in the bowl, boing */}
      <Cue at={s4 + SC4.pour} src="pour.wav" volume={0.6} frames={48} />
      <Cue at={s4 + SC4.coffee} src="pour.wav" volume={0.3} frames={40} />
      <Cue at={s4 + SC4.splash} src="splash.ogg" volume={0.8} frames={30} />
      <Cue at={s4 + SC4.boing} src="boing.flac" volume={0.6} frames={40} />
      {/* 5: bonk, birds round the head, a louder bonk, the slow turtle tune */}
      <Cue at={s5 + SC5.bonk1} src="bonk.ogg" volume={0.7} frames={30} />
      <Cue at={s5 + SC5.bonk1 + 12} src="birds.ogg" volume={0.35} frames={130} />
      <Cue at={s5 + SC5.bonk2} src="bonk2.ogg" volume={1} frames={30} />
      <Cue at={s5 + SC5.bonk2 + 8} src="slide-whistle.wav" volume={0.35} frames={36} />
      <Sequence from={s5 + SC5.turtle} durationInFrames={SC5_LEN - SC5.turtle} layout="none"><Audio src={staticFile("audio/music-turtle.wav")} volume={(f) => 0.55 * Math.min(1, f / 10)} /></Sequence>
      {/* 6: slow ticks, the lullaby dream, "!!", the toothpicks pinging into the ceiling */}
      {Array.from({ length: 13 }).map((_, i) => <Cue key={`t6${i}`} at={s6 + 10 + i * 30} src="tick.wav" volume={0.4} frames={4} />)}
      <Sequence from={s6 + SC6.dream} durationInFrames={SC6.alert - SC6.dream} layout="none"><Audio src={staticFile("audio/music-lullaby.wav")} volume={(f) => 0.5 * Math.min(1, f / 10)} loop /></Sequence>
      <Cue at={s6 + SC6.alert} src="alert.ogg" volume={0.8} frames={20} />
      {SC6.ping.map((t) => <Cue key={`pg${t}`} at={s6 + t} src="ping.ogg" volume={0.7} frames={22} />)}
      {/* 7: gulps getting faster, the action music, the buzz */}
      {SC7.gulps.map((t, i) => <Cue key={`gl${i}`} at={s7 + t} src="gulp.wav" volume={0.75} frames={14} />)}
      <Sequence from={s7 + SC7.rush} durationInFrames={SC7_LEN - SC7.rush + SC8.off} layout="none"><Audio src={staticFile("audio/music-coffee-rush.wav")} volume={(f) => 0.5 * Math.min(1, f / 6)} loop /></Sequence>
      <Cue at={s7 + SC7.buzz} src="vibrate.wav" volume={0.45} frames={SC7_LEN - SC7.buzz} />
      <Cue at={s8} src="vibrate.wav" volume={0.45} frames={SC8.off} />
      {/* 8: power-down, thud, a snore */}
      <Cue at={s8 + SC8.off} src="powerdown.wav" volume={0.8} frames={42} />
      <Cue at={s8 + SC8.thud} src="thud.ogg" volume={1} frames={24} />
      <Cue at={s8 + SC8.snore} src="snore.wav" volume={0.6} frames={96} />
      {/* 9: the lock, the "fully charged" ting, morning birds, a ding on the final card */}
      <Cue at={s9 + SC9.lock} src="lock.ogg" volume={0.8} frames={20} />
      <Cue at={s9 + SC9.charge} src="charge.ogg" volume={0.6} frames={40} />
      <Cue at={s9 + SC9.morning} src="birds.ogg" volume={0.3} frames={SC9_LEN - SC9.morning} />
      <Cue at={s9 + SC9.card} src="ding.mp3" volume={0.6} frames={30} />
    </>
  );
};

export const SleepVideo: React.FC<{ upto?: number }> = ({ upto = SCENES.length }) => {
  const total = starts[upto - 1] + SCENES[upto - 1].len;
  // silent-film comedy under everything, lower than the effects; it steps aside for the "loading" music
  // the comedy track steps aside for each short cue (loading, turtle, lullaby, coffee rush) and stops at the power-down
  const ducks: [number, number][] = [
    [starts[2] + SC3.load, starts[2] + SC3.realize + 20],
    [starts[4] + SC5.turtle, starts[5]],
    [starts[5] + SC6.dream, starts[5] + SC6.alert],
    [starts[6] + SC7.rush, starts[7] + SC8.off],
  ];
  const comedyEnd = upto > 7 ? starts[7] + SC8.off : total;
  const warmFrom = upto > 8 ? starts[8] : total;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={comedyEnd} layout="none">
        <Audio src={staticFile("audio/music-comedy.mp3")} loop volume={(f) => {
          const duck = ducks.some(([a, b]) => f > a - 6 && f < b) ? 0.12 : 1;
          return 0.16 * duck * Math.min(1, f / 15) * Math.min(1, (comedyEnd - f) / 8);
        }} />
      </Sequence>
      {upto > 8 && <Sequence from={warmFrom} durationInFrames={total - warmFrom} layout="none">
        <Audio src={staticFile("audio/music-warm.mp3")} volume={(f) => 0.24 * Math.min(1, f / 30) * Math.min(1, (total - warmFrom - f) / 45)} />
      </Sequence>}
      <Effects />
      {SCENES.slice(0, upto).map(({ C, len }, i) => (
        <Sequence key={i} name={`Cảnh ${i + 1}`} from={starts[i]} durationInFrames={len}>
          <SceneFrame C={C} len={len} first={i === 0} last={i === upto - 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export const SleepPreview: React.FC = () => <SleepVideo upto={3} />;
export const SleepFull: React.FC = () => <SleepVideo />;
