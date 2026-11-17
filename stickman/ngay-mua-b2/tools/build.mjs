// Writes project.json (directing-stickman-videos B2 manifest v1, native 9:16) for "Rainy day: plan vs. reality".
// Motion is choreographed with GSAP timelines (paused, seeked per sample) and baked into the runtime's layer keys,
// so the bundled renderer plays exactly what the timeline says. Captions/timing come from the accepted Edge TTS
// recordings (video/src/Rain/data.ts); this file only places them on the joined narration track.
// usage: node tools/build.mjs [--upto 2]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire('/home/user/Phim-hoat-hinh/video/package.json');
const { gsap } = require('gsap');
const OFF = JSON.parse(fs.readFileSync(path.join(ROOT, 'art/offsets.json'), 'utf8'));
const data = fs.readFileSync('/home/user/Phim-hoat-hinh/video/src/Rain/data.ts', 'utf8');
const SCENES = JSON.parse(data.slice(data.indexOf('= [') + 2, data.lastIndexOf(';')));
const WIN = { x: 560, y: 600, w: 460, h: 500 };
const SAMPLE = 1 / 15;

// where each scene sits on the joined narration track (scene 2 gets one more second of PLAN before "Page one")
const EXTRA_LEAD = { 2: 1.0 };
const sceneStart = {}; let acc = 0;
for (const sc of SCENES.slice(0, 2)) { sceneStart[sc.n] = acc; acc += sc.frames / 30 + (EXTRA_LEAD[sc.n] ?? 0); }
const at = (n, t) => sceneStart[n] + (EXTRA_LEAD[n] ?? 0) + t;           // scene-relative speech time → track time
const line = (n, i) => SCENES[n - 1].lines[i];

// ---------- GSAP: build a paused timeline per animated layer and sample it into runtime keys ----------
function keysFrom(init, build, span, props) {
  const s = { ...init }; const tl = gsap.timeline({ paused: true }); build(tl, s);
  const keys = [];
  for (let t = 0; t <= span + 1e-6; t += SAMPLE) { tl.seek(t, false); const k = { t: Math.floor(Math.min(t, span) * 1000) / 1000 }; for (const p of props) k[p] = +(p === 'alpha' ? Math.min(1, Math.max(0, +s[p])) : +s[p]).toFixed(3); if (!keys.length || k.t > keys.at(-1).t) keys.push(k); }
  return keys;
}
const img = (id, file, extra = {}) => { const o = OFF[file]; return { type: 'image', id, path: `art/${file}`, x: o.x, y: o.y, w: o.w, h: o.h, ...extra }; };
// rain keeps falling outside: a sawtooth loop (each cycle 0.8 s)
function rainKeys(span) { const y0 = WIN.y - 120, k = []; for (let t = 0; t < span - 0.05; t += 0.4) { k.push({ t: +t.toFixed(3), y: y0 }); const e = Math.floor(Math.min(span, t + 0.399) * 1000) / 1000; if (e > k.at(-1).t) k.push({ t: e, y: +(y0 + 120 * (e - t) / 0.4).toFixed(2) }); } return k; }

const shots = [];
// ================= Shot 1 · bedroom: it's raining, Lily has a plan =================
{
  const sc = 1, start = sceneStart[1], end = sceneStart[2], span = end - start;
  const T = (i) => at(sc, line(sc, i).t0) - start;
  const lilyX = OFF['s1-lily-pull.png'].x - 70;      // Lily stands a little left of the art origin
  const curtains = (side) => keysFrom({ x: side < 0 ? WIN.x - 4 : WIN.x + WIN.w / 2 + 4 }, (tl, s) => tl.to(s, { x: side < 0 ? WIN.x - 120 : WIN.x + WIN.w - 140, duration: 0.8, ease: 'power2.out' }, 0.6), span, ['x']);
  const cloud = keysFrom({ y: WIN.y + 300, x: WIN.x + 40 }, (tl, s) => {
    tl.to(s, { y: WIN.y + 70, duration: 1.0, ease: 'back.out(1.6)' }, 0.9);
    for (let t = 2.0; t < span; t += 1.2) tl.to(s, { y: WIN.y + (Math.round(t / 1.2) % 2 ? 90 : 60), duration: 1.2, ease: 'sine.inOut' }, t);
  }, span, ['x', 'y']);
  const card = keysFrom({ y: 420, alpha: 0.2 }, (tl, s) => { tl.to(s, { y: 470, alpha: 1, duration: 0.45, ease: 'back.out(2)' }, T(1) + 0.15).to(s, { y: 380, alpha: 0.2, duration: 0.4, ease: 'power2.in' }, T(3) - 0.4); }, span, ['y', 'alpha']);
  const sparkle = (dx, dy, d) => keysFrom({ y: 470 + dy, alpha: 0.3 }, (tl, s) => { tl.to(s, { alpha: 1, y: 450 + dy, duration: 0.25 }, T(2) + d).to(s, { alpha: 0.3, y: 430 + dy, duration: 0.3 }, T(2) + d + 0.6); }, span, ['y', 'alpha']);
  const fistSpark = (dx, d) => keysFrom({ y: 1000, alpha: 0.3 }, (tl, s) => { tl.to(s, { alpha: 1, y: 960, duration: 0.2 }, T(3) + 0.4 + d).to(s, { alpha: 0.3, y: 930, duration: 0.3 }, T(3) + 0.9 + d); }, span, ['y', 'alpha']);
  // keys are shot-relative: the bounce starts when the fist goes up
  const lilyBob = (from, to) => keysFrom({ y: OFF['s1-lily-fist.png'].y }, (tl, s) => { for (let t = from; t < to - 0.3; t += 0.36) tl.to(s, { y: OFF['s1-lily-fist.png'].y - (Math.round((t - from) / 0.36) % 2 ? 0 : 16), duration: 0.36, ease: 'sine.inOut' }, t); }, span, ['y']);
  const pose = (file, from, to, keys) => img(`s1-${file.replace('.png', '')}`, file, { x: lilyX, from, to, ...(keys ? { keys, motion: { role: 'actor', reason: 'Lily bounces with determination as she promises to be a better person' } } : {}) });
  shots.push({
    start, end,
    layers: [
      img('s1-outside', 'outside.png'),
      img('s1-cloud', 'cloud.png', { to: 9.0, keys: cloud, motion: { role: 'prop', reason: 'The rain cloud rises into the window and bobs, waving hello' } }),
      img('s1-cloud-sly', 'cloud-sly.png', { from: 9.0, keys: cloud }),
      img('s1-rain', 'rain.png', { keys: rainKeys(span), motion: { role: 'prop', reason: 'Rain keeps falling outside the window all morning' } }),
      img('s1-room', 's1-room.png'),
      img('s1-curtain-l', 'curtain-l-plan.png', { x: WIN.x, y: WIN.y - 40, keys: curtains(-1), motion: { role: 'prop', reason: 'Lily pulls the left curtain open on the rain' } }),
      img('s1-curtain-r', 'curtain-r-plan.png', { x: WIN.x + WIN.w / 2, y: WIN.y - 40, keys: curtains(1), motion: { role: 'prop', reason: 'The right curtain slides open to reveal the rain' } }),
      pose('s1-lily-pull.png', 0, 1.7),
      pose('s1-lily-look.png', 1.7, T(1)),
      pose('s1-lily-think.png', T(1), T(3)),
      { ...pose('s1-lily-fist.png', T(3), span, lilyBob(T(3), span)), keys: lilyBob(T(3), span) },
      img('s1-plan-card', 'plan-card.png', { x: 92, y: 470, from: +(T(1) + 0.15).toFixed(3), to: +(T(3)).toFixed(3), keys: card, motion: { role: 'information', reason: "Today's plan pops up: the four tasks Lily intends to do" } }),
      img('s1-spark-a', 'sparkle.png', { x: 100, from: +T(2).toFixed(3), to: +(T(2) + 0.95).toFixed(3), keys: sparkle(0, 0, 0), motion: { role: 'information', reason: 'Sparkles mark the plan as very productive' } }),
      img('s1-spark-b', 'sparkle.png', { x: 520, from: +(T(2) + 0.25).toFixed(3), to: +(T(2) + 1.2).toFixed(3), keys: sparkle(0, 300, 0.25), motion: { role: 'information', reason: 'Sparkles mark the plan as very productive' } }),
      img('s1-spark-c', 'sparkle.png', { x: 620, from: +(T(3) + 0.4).toFixed(3), to: +(T(3) + 1.25).toFixed(3), keys: fistSpark(0, 0), motion: { role: 'information', reason: 'A sparkle bursts from the raised fist' } }),
      img('s1-heading', 'head-s1.png', { x: 290, y: 200, to: T(1) }),
    ],
    portrait: {
      intent: 'Window and rain cloud upper right, Lily standing left of it with her plan card above her head; all above the caption band.',
      background_ids: ['s1-room', 's1-outside'],
      regions: [
        { id: 's1-window', role: 'prop', layer_ids: ['s1-cloud', 's1-cloud-sly', 's1-rain', 's1-curtain-l', 's1-curtain-r'], region: { x: 430, y: 470, w: 690, h: 900 }, intent: 'The window: curtains open, the cloud rises and waves while rain falls.' },
        { id: 's1-lily', role: 'actor', layer_ids: ['s1-s1-lily-pull', 's1-s1-lily-look', 's1-s1-lily-think', 's1-s1-lily-fist', 's1-spark-c'], region: { x: 300, y: 900, w: 420, h: 740 }, intent: 'Lily pulls the curtain, turns to us, thinks, then raises a determined fist.' },
        { id: 's1-plan', role: 'information', layer_ids: ['s1-plan-card', 's1-spark-a', 's1-spark-b', 's1-heading'], region: { x: 77, y: 190, w: 1040, h: 840 }, intent: "The heading, then today's plan card with its four tasks and sparkles." },
      ],
    },
  });
}
// ================= Shot 2 · PLAN: the picture-perfect reading corner =================
const TEAR = 6.4; // seconds into scene 2 (PLAN lasts until the rip)
{
  const start = sceneStart[2], end = +(start + TEAR).toFixed(3), span = end - start;
  const steam = (d) => keysFrom({ y: 1210, alpha: 0.25 }, (tl, s) => { for (let t = d; t < span; t += 1.6) { tl.set(s, { y: 1210, alpha: 0.25 }, t).to(s, { y: 1130, alpha: 1, duration: 0.6 }, t).to(s, { y: 1060, alpha: 0.25, duration: 0.9 }, t + 0.6); } }, span, ['y', 'alpha']);
  const glow = keysFrom({ alpha: 0.2 }, (tl, s) => { for (let t = 0; t < span; t += 0.9) tl.to(s, { alpha: Math.round(t / 0.9) % 2 ? 0.25 : 0.9, duration: 0.9, ease: 'sine.inOut' }, t); }, span, ['alpha']);
  const badge = keysFrom({ y: 196, alpha: 0 }, (tl, s) => tl.to(s, { y: 226, alpha: 1, duration: 0.4, ease: 'back.out(2.5)' }, 0.3), span, ['y', 'alpha']);
  const head = keysFrom({ alpha: 0, y: 440 }, (tl, s) => tl.to(s, { alpha: 1, y: 410, duration: 0.4 }, 0.6), span, ['y', 'alpha']);
  const read = keysFrom({ y: OFF['s2-lily-read.png'].y }, (tl, s) => { for (let t = 0.5; t < span; t += 1.4) tl.to(s, { y: OFF['s2-lily-read.png'].y - (Math.round(t / 1.4) % 2 ? 0 : 6), duration: 1.4, ease: 'sine.inOut' }, t); }, span, ['y']);
  shots.push({
    start, end,
    layers: [
      img('s2p-outside', 'outside.png'),
      img('s2p-cloud', 'cloud.png', { x: WIN.x + 30, y: WIN.y + 60 }),
      img('s2p-rain', 'rain.png', { keys: rainKeys(span), motion: { role: 'prop', reason: 'Soft rain falls past the window of the cosy corner' } }),
      img('s2p-room', 's2-plan-room.png'),
      img('s2p-glow', 'lights-glow.png', { x: WIN.x - 60 + OFF['lights-glow.png'].x, y: WIN.y - 90 + OFF['lights-glow.png'].y, keys: glow }),
      img('s2p-lights', 'lights.png', { x: WIN.x - 60 + OFF['lights.png'].x, y: WIN.y - 90 + OFF['lights.png'].y }),
      img('s2p-lily', 's2-lily-read.png', { keys: read, motion: { role: 'actor', reason: 'Lily reads contentedly, breathing with the page' } }),
      img('s2p-mug', 'mug-plan.png', { x: 840 + OFF['mug-plan.png'].x, y: 1290 + OFF['mug-plan.png'].y }),
      img('s2p-steam', 'steam.png', { x: 880, keys: steam(0.2), motion: { role: 'prop', reason: 'Steam curls up from the hot tea' } }),
      img('s2p-badge', 'badge-plan.png', { x: 92, keys: badge }),
      img('s2p-head', 'head-s2-plan.png', { x: 290, keys: head }),
    ],
    portrait: {
      intent: 'The bright reading corner: PLAN badge and heading at the top, the window right, Lily on the cushion with tea beside her.',
      background_ids: ['s2p-room', 's2p-outside'],
      regions: [
        { id: 's2p-window', role: 'prop', layer_ids: ['s2p-cloud', 's2p-rain', 's2p-glow', 's2p-lights'], region: { x: 430, y: 470, w: 690, h: 770 }, intent: 'Rain and fairy lights at the window, the warm promise of a cosy day.' },
        { id: 's2p-reading', role: 'actor', layer_ids: ['s2p-lily', 's2p-mug', 's2p-steam'], region: { x: 280, y: 1020, w: 820, h: 620 }, intent: 'Lily reads on her cushion; the tea steams on the low table.' },
        { id: 's2p-label', role: 'information', layer_ids: ['s2p-badge', 's2p-head'], region: { x: 77, y: 190, w: 1045, h: 470 }, intent: 'PLAN badge and the plan: read a book.' },
      ],
    },
  });
}
// ================= Shot 3 · REALITY: page one, fifteen photos, asleep =================
{
  const sc = 2, start = +(sceneStart[2] + TEAR).toFixed(3), end = +(sceneStart[2] + SCENES[1].frames / 30 + EXTRA_LEAD[2]).toFixed(3), span = end - start;
  const T = (i) => at(sc, line(sc, i).t0) - start;
  // the rip: both halves of the PLAN frame fall away (GSAP), revealing the grey room underneath
  const half = (side) => keysFrom({ x: 0, y: 0, angle: 0, alpha: 1 }, (tl, s) => tl.to(s, { x: side * 820, y: 380, angle: side * 0.26, duration: 0.85, ease: 'power2.in' }, 0).to(s, { alpha: 0, duration: 0.01 }, 0.86), span, ['x', 'y', 'angle', 'alpha']);
  const badge = keysFrom({ y: 196, alpha: 0 }, (tl, s) => tl.to(s, { y: 226, alpha: 1, duration: 0.4, ease: 'back.out(2.5)' }, 0.55), span, ['y', 'alpha']);
  const flashes = 15, f0 = T(1) - 0.2, fd = 2.4;
  const flash = keysFrom({ alpha: 0 }, (tl, s) => { for (let k = 0; k < flashes; k++) tl.set(s, { alpha: 0.7 }, f0 + k * fd / flashes).to(s, { alpha: 0, duration: 0.12 }, f0 + k * fd / flashes + 0.02); }, span, ['alpha']);
  const sleepAt = T(2) + 0.35, yawnAt = T(0) + 0.9, selfieAt = T(1) - 0.6;
  const zee = (d) => keysFrom({ y: 1380, alpha: 0.3 }, (tl, s) => { for (let t = sleepAt + 0.8 + d; t < span; t += 1.8) tl.set(s, { y: 1380, alpha: 0.3 }, t).to(s, { y: 1300, alpha: 1, duration: 0.6 }, t).to(s, { y: 1200, alpha: 0.3, duration: 0.9 }, t + 0.6); }, span, ['y', 'alpha']);
  const pg = (k, from, to) => img(`s2r-page-${k}`, `page-${k}.png`, { x: 470 + OFF[`page-${k}.png`].x, y: 1290 + OFF[`page-${k}.png`].y, from, to });
  const counter = Array.from({ length: flashes }, (_, k) => ({ type: 'text', id: `s2r-count-${k + 1}`, text: String(k + 1), x: 820, y: 1070, size: 64, from: +(f0 + k * fd / flashes).toFixed(3), to: k === flashes - 1 ? +(sleepAt - 0.1).toFixed(3) : +(f0 + (k + 1) * fd / flashes).toFixed(3) }));
  shots.push({
    start, end,
    layers: [
      img('s2r-outside', 'outside-dark.png'),
      img('s2r-rain', 'rain.png', { keys: rainKeys(span), motion: { role: 'prop', reason: 'Grey rain keeps falling on the real afternoon' } }),
      img('s2r-room', 's2-real-room.png'),
      img('s2r-mug', 'mug-real.png', { x: 840 + OFF['mug-real.png'].x, y: 1290 + OFF['mug-real.png'].y }),
      img('s2r-lily-tired', 's2-lily-tired.png', { to: yawnAt }),
      pg(0, T(0) + 0.05, T(0) + 0.25), pg(1, T(0) + 0.25, T(0) + 0.45), pg(2, T(0) + 0.45, T(0) + 0.65),
      img('s2r-lily-yawn', 's2-lily-yawn.png', { from: yawnAt, to: selfieAt }),
      img('s2r-lily-selfie', 's2-lily-selfie.png', { from: selfieAt, to: sleepAt, keys: keysFrom({ y: OFF['s2-lily-selfie.png'].y }, (tl, s) => { for (let k = 0; k < flashes; k++) tl.to(s, { y: OFF['s2-lily-selfie.png'].y - (k % 2 ? 0 : 10), duration: fd / flashes, ease: 'sine.inOut' }, f0 + k * fd / flashes); }, span, ['y']), motion: { role: 'actor', reason: 'Lily strikes a new pose for each of the fifteen selfies' } }),
      img('s2r-lily-sleep', 's2-lily-sleep.png', { from: sleepAt, x: OFF['s2-lily-sleep.png'].x + 40, y: OFF['s2-lily-sleep.png'].y - 10 }),
      img('s2r-zee-a', 'zee.png', { x: 120, from: +(sleepAt + 0.8).toFixed(3), keys: zee(0), motion: { role: 'information', reason: 'Snores rise from under the book: zero pages after that' } }),
      img('s2r-zee-b', 'zee.png', { x: 170, from: +(sleepAt + 1.4).toFixed(3), keys: zee(0.6), motion: { role: 'information', reason: 'Snores rise from under the book: zero pages after that' } }),
      img('s2r-counter', 'counter.png', { x: 690, y: 990, from: +f0.toFixed(3), to: +(sleepAt - 0.1).toFixed(3) }),
      ...counter,
      img('s2r-flash', 'flash.png', { keys: flash }),
      img('s2r-badge', 'badge-real.png', { x: 92, keys: badge }),
      img('s2r-tear-l', 'tear-l.png', { keys: half(-1), to: 0.9 }),
      img('s2r-tear-r', 'tear-r.png', { keys: half(1), to: 0.9 }),
    ],
    portrait: {
      intent: 'The same corner in grey: Lily reads one page, poses for fifteen selfies with the counter beside her, then falls asleep under the book.',
      background_ids: ['s2r-room', 's2r-outside', 's2r-flash', 's2r-tear-l', 's2r-tear-r'],
      regions: [
        { id: 's2r-window', role: 'prop', layer_ids: ['s2r-rain'], region: { x: 540, y: 470, w: 500, h: 770 }, intent: 'Cold rain behind the glass.' },
        { id: 's2r-lily', role: 'actor', layer_ids: ['s2r-lily-tired', 's2r-lily-yawn', 's2r-lily-selfie', 's2r-lily-sleep', 's2r-page-0', 's2r-page-1', 's2r-page-2', 's2r-zee-a', 's2r-zee-b', 's2r-mug'], region: { x: 80, y: 900, w: 1040, h: 768 }, intent: 'Page one turns, then the selfie pose, then asleep with the book on her face; snores rise.' },
        { id: 's2r-count', role: 'information', layer_ids: ['s2r-counter', ...counter.map(c => c.id), 's2r-badge'], region: { x: 77, y: 190, w: 1040, h: 1000 }, intent: 'The REALITY badge and the photo counter climbing to fifteen.' },
      ],
    },
  });
}
// ---------- captions: English on the runtime track (semantic single lines); bilingual pairs for our overlay ----------
const cues = [], bilingual = [];
for (const n of [1, 2]) for (const ln of SCENES[n - 1].lines) {
  const t0 = at(n, ln.t0), t1 = at(n, ln.t1);
  // single-line runtime cues: split long lines at the word boundary nearest the middle (a semantic pause)
  const words = ln.en.split(' ');
  let parts = [ln.en];
  if (ln.en.length > 26) { let best = 1, bd = 1e9; for (let i = 1; i < words.length; i++) { const d = Math.abs(words.slice(0, i).join(' ').length - ln.en.length / 2) - (/[,.…]$/.test(words[i - 1]) ? 6 : 0); if (d < bd) { bd = d; best = i; } } parts = [words.slice(0, best).join(' '), words.slice(best).join(' ')]; }
  let s = t0; parts.forEach((p, i) => { const e = i === parts.length - 1 ? t1 + 0.3 : t0 + (t1 - t0) * (parts[0].length / ln.en.length); cues.push({ start: +s.toFixed(3), end: +e.toFixed(3), text: p }); s = e; });
  bilingual.push({ who: ln.who, start: +t0.toFixed(3), end: +(t1 + 0.4).toFixed(3), en: ln.en, vi: ln.vi });
}
for (let i = 0; i < cues.length - 1; i++) cues[i].end = Math.min(cues[i].end, cues[i + 1].start);
const shotEnd = shots.at(-1).end;
const T2 = (i) => at(2, line(2, i).t0);
const fx = (path, time, gain, duration) => ({ kind: 'file', path, time: +time.toFixed(3), gain, ...(duration ? { duration } : {}) });
const SFX = [
  fx('audio/swipe2.wav', 0.6, 0.5),                                   // the curtains swish open
  fx('audio/thunder.ogg', at(1, line(1, 0).t0) + 0.2, 0.22, 2.0),      // the cloud's thunderous hello
  fx('audio/ding.mp3', at(1, line(1, 1).t0) + 0.2, 0.35),              // the plan card
  fx('audio/wahwah.wav', sceneStart[2] + TEAR, 0.55),                 // PLAN rips → REALITY
  fx('audio/page.ogg', T2(0) + 0.05, 0.6),                            // page one
  ...Array.from({ length: 15 }, (_, k) => fx('audio/shutter.wav', T2(1) - 0.2 + k * 2.4 / 15, 0.35)),   // fifteen photos
  fx('audio/snore.wav', T2(2) + 1.2, 0.5),
  fx('audio/snore.wav', T2(2) + 4.0, 0.45),
];
const project = {
  version: 1, style: 'B2', width: 1080, height: 1920, fps: 30,
  font: '/home/user/Phim-hoat-hinh/video/public/fonts/PatrickHand-Regular.ttf',
  voice: { path: 'audio/narration-s1-s2.wav', lead: 0, tail: 0 },
  captions: cues,
  caption_override: { reason: 'Bilingual subtitles (English on top in pale yellow, Vietnamese below in white with a black outline) as in the video-nguoi-que skill; burned by tools/render-bilingual.mjs over the B2 picture.', user_approval: "User request (2026-11-17): 'Phụ đề làm theo skill video-nguoi-que: tiếng Anh ở trên (vàng nhạt), tiếng Việt ở dưới (trắng viền đen)'." },
  portrait: { safe_area: { left: 0.06, right: 0.12, top: 0.08, bottom: 0.18 } },
  reference_review: { author_id: 'claude-code-agent', capability: { mode: 'limited', environment: 'Claude Code cloud container, no image-generation API, code-drawn artwork', limitations: [{ capability: 'image generation', observed: 'no Gemini/other image key configured; doctor reports gemini_key_present: false', impact: 'all artwork is drawn by code (canvas), simpler than the painted public B2 samples' }] } },
  shots,
  // story sound (also used by the final ffmpeg mix in tools/render-bilingual.mjs): rain bed throughout, actions on cue
  ambience: [{ path: 'audio/rain-loop.ogg', start: 0, end: +shotEnd.toFixed(3), gain: 0.08, fadeIn: 1, fadeOut: 1 }],
  music: { path: 'audio/music-plan.mp3', gain: 0.05 },
  sfx: SFX,
  metadata: { rip: +(sceneStart[2] + TEAR).toFixed(3), title: 'Rainy day: plan vs. reality', scope: 'scenes 1–2 preview', bilingual_captions: 'captions-bilingual.json', motion: 'GSAP timelines sampled at 15 fps into layer keys (tools/build.mjs)' },
};
fs.writeFileSync(path.join(ROOT, 'project.json'), JSON.stringify(project, null, 1));
fs.writeFileSync(path.join(ROOT, 'captions-bilingual.json'), JSON.stringify(bilingual, null, 1));
console.log(`project.json: ${shots.length} shots, ${cues.length} runtime cues, ${bilingual.length} bilingual lines, picture to ${shotEnd.toFixed(2)} s`);
