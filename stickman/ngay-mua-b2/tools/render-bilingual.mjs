// Render the B2 project with the directing-stickman-videos painter (unmodified, imported from the installed Skill),
// replacing the runtime's single-line ivory caption with the user-requested bilingual subtitles (video-nguoi-que:
// English on top in pale yellow, Vietnamese below in white with a black outline, speaker name tag), then mix the
// sound with ffmpeg: original-speed narration, story SFX, rain bed all the way through, PLAN/REALITY music that
// ducks under the voice (sidechain), limiter and two-pass loudness normalization to -14 LUFS / -1.5 dBTP for TikTok.
// usage: node tools/render-bilingual.mjs <project.json> <out.mp4> [--seconds N]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const SKILL = '/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos';
const { loadProject } = await import(path.join(SKILL, 'scripts/autopilot-core.mjs'));
const { painter } = await import(path.join(SKILL, 'scripts/autopilot-render.mjs'));
const require = createRequire(path.join(SKILL, 'package.json'));
const { GlobalFonts } = require('@napi-rs/canvas');

const [projectFile, outFile] = process.argv.slice(2);
const si = process.argv.indexOf('--seconds');
const seconds = si > 0 ? Number(process.argv[si + 1]) : undefined;
const p = loadProject(projectFile, seconds ? { seconds } : {});
const base = path.dirname(path.resolve(projectFile));
const bilingual = JSON.parse(fs.readFileSync(path.join(base, p.metadata.bilingual_captions), 'utf8'));
const dur = p.rangeEnd, fps = p.fps, frames = Math.round(dur * fps);
const tmp = path.join(base, 'output', 'tmp'); fs.mkdirSync(tmp, { recursive: true });

// ---------- picture: painter frames without the runtime caption, plus our bilingual subtitles ----------
GlobalFonts.registerFromPath(path.join(SKILL, 'assets/fonts/NotoSans.ttf'), 'SubSans');
const draw = await painter(p);
const omit = p.captions.map((_, i) => `caption-${i}`);
const NAME = { Lily: '#c0567a', Mom: '#7c5cb8', Max: '#3f74b8' };
const S = p.width / 1280;                         // design units → pixels
const BAND = 1712 * S, EN_Y = 1752 * S, VI_Y = 1828 * S; // inside the B2 portrait caption band (safe area)
const fade = (t, a, b) => Math.max(0, Math.min(1, (t - a) / 0.12, (b - t) / 0.12));
function wrapLine(ctx, text, max) { const w = text.split(' '); let line = ''; const out = []; for (const x of w) { const t = line ? line + ' ' + x : x; if (ctx.measureText(t).width > max && line) { out.push(line); line = x; } else line = t; } if (line) out.push(line); return out; }
function subtitles(ctx, t) {
  const cue = bilingual.find((c, i) => t >= c.start && t < Math.min(c.end, bilingual[i + 1]?.start ?? 1e9));
  if (!cue) return;
  const end = Math.min(cue.end, bilingual[bilingual.indexOf(cue) + 1]?.start ?? 1e9), a = fade(t, cue.start, end);
  const name = cue.who === 'Narrator' ? null : cue.who, max = 1040 * S;
  // lay both languages out first (max two lines each), then stack them as one block inside the caption band
  const layout = (txt, size) => { let lines; for (;;) { ctx.font = `600 ${size * S}px SubSans`; lines = wrapLine(ctx, txt, max - (name ? 130 * S : 0)); if (lines.length <= 2 || size <= 40) break; size -= 2; } return { lines, size, lh: size * 1.18 * S }; };
  const en = layout(cue.en, 58), vi = layout(cue.vi, 60);
  const gap = 10 * S, total = en.lines.length * en.lh + gap + vi.lines.length * vi.lh;
  const top = Math.min(BAND + 18 * S, 1870 * S - total);
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(30,30,28,.55)'; ctx.beginPath(); ctx.roundRect(50 * S, top - 16 * S, 1180 * S, total + 32 * S, 30 * S); ctx.fill();
  const draw = ({ lines, size, lh }, y0, fill, stroke) => lines.forEach((l, i) => {
    const y = y0 + lh * (i + 0.5); let x = p.width / 2;
    ctx.font = `600 ${size * S}px SubSans`; const lw = ctx.measureText(l).width;
    if (name && i === 0) {   // a small coloured name tag before the speaker's line
      ctx.font = `600 ${size * 0.6 * S}px SubSans`; const nw = ctx.measureText(name).width + 24 * S;
      const left = p.width / 2 - (lw + nw + 12 * S) / 2;
      ctx.fillStyle = NAME[name] ?? '#475569'; ctx.beginPath(); ctx.roundRect(left, y - size * .4 * S, nw, size * .8 * S, 14 * S); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(name, left + nw / 2, y); x = left + nw + 12 * S + lw / 2;
    }
    ctx.font = `600 ${size * S}px SubSans`; ctx.lineWidth = 8 * S; ctx.strokeStyle = stroke; ctx.strokeText(l, x, y); ctx.fillStyle = fill; ctx.fillText(l, x, y);
  });
  draw(en, top, '#fde68a', '#1f2328');
  draw(vi, top + en.lines.length * en.lh + gap, '#ffffff', '#000000');
  ctx.restore();
}
const silent = path.join(tmp, 'picture.mp4');
await new Promise((resolve, reject) => {
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${p.width}x${p.height}`, '-framerate', String(fps), '-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', silent]);
  let err = ''; ff.stderr.on('data', b => { err += b; }); ff.on('close', c => c === 0 ? resolve() : reject(new Error(err)));
  (async () => {
    for (let i = 0; i < frames; i++) {
      const t = i / fps, canvas = draw(t, { omitIds: omit }), ctx = canvas.getContext('2d');
      ctx.resetTransform(); subtitles(ctx, t);
      const buf = ctx.getImageData(0, 0, p.width, p.height).data;
      if (!ff.stdin.write(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength))) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) process.stderr.write(`frame ${i}/${frames}\n`);
    }
    ff.stdin.end();
  })().catch(reject);
});

// ---------- sound: voice + SFX (the key for ducking), rain + music bed under it ----------
const media = (f) => path.resolve(base, f);
const inputs = ['-i', media(p.voice.path)];
const fc = [`[0:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${dur}[voice]`];
const fx = p.sfx.filter(s => s.time < dur);
fx.forEach((s, i) => { inputs.push('-i', media(s.path)); fc.push(`[${i + 1}:a]aresample=48000,aformat=channel_layouts=stereo,${s.duration ? `atrim=0:${s.duration},` : ''}volume=${s.gain},adelay=${Math.round(s.time * 1000)}:all=1[f${i}]`); });
const nFx = fx.length;
fc.push(`[voice]${fx.map((_, i) => `[f${i}]`).join('')}amix=inputs=${nFx + 1}:normalize=0,atrim=0:${dur}[stem]`);
// bed: rain everywhere; PLAN music until the rip, REALITY music after it (from project metadata marks)
const rip = p.metadata.rip ?? dur;
inputs.push('-stream_loop', '-1', '-i', media(p.ambience[0].path));
const ir = nFx + 1;
fc.push(`[${ir}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${dur},volume=0.34,afade=t=in:d=1,afade=t=out:st=${dur - 1}:d=1[rain]`);
inputs.push('-stream_loop', '-1', '-i', media('audio/music-plan.mp3'), '-stream_loop', '-1', '-i', media('audio/music-reality.mp3'));
fc.push(`[${ir + 1}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${Math.min(rip, dur)},volume=0.42,afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, Math.min(rip, dur) - 0.4)}:d=0.4,apad=whole_dur=${dur}[mp]`);
if (rip < dur) fc.push(`[${ir + 2}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${dur - rip - 0.8},volume=0.5,afade=t=in:d=0.6,adelay=${Math.round((rip + 0.8) * 1000)}:all=1,apad=whole_dur=${dur}[mr]`);
fc.push(`[rain][mp]${rip < dur ? '[mr]' : ''}amix=inputs=${rip < dur ? 3 : 2}:normalize=0,atrim=0:${dur}[bed]`);
fc.push('[stem]asplit=2[v][key]', '[bed][key]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[duck]',
  '[v][duck]amix=inputs=2:normalize=0,alimiter=limit=0.56:level=false:attack=1:release=50[mix]');
const graph = fc.join(';'), LN = 'loudnorm=I=-14:TP=-1.5:LRA=20';
const r = spawnSync('ffmpeg', ['-hide_banner', ...inputs, '-filter_complex', `${graph};[mix]${LN}:print_format=json[o]`, '-map', '[o]', '-t', String(dur), '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
const m = JSON.parse(r.stderr.match(/\{[^{}]+\}/g).at(-1));
const meas = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
const fin = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', silent, ...inputs, '-filter_complex', `${graph.replace(/\[(\d+):a\]/g, (_, n) => `[${+n + 1}:a]`)};[mix]${LN}:${meas},aresample=48000[o]`, '-map', '0:v', '-map', '[o]', '-c:v', 'copy', '-dn', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur), '-movflags', '+faststart', outFile], { encoding: 'utf8' });
if (fin.status !== 0) throw new Error(fin.stderr);
// sidecar subtitles (EN and VI), from the bilingual cues
const ts = (s) => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
for (const lang of ['en', 'vi']) fs.writeFileSync(outFile.replace(/\.mp4$/, `.${lang}.srt`), bilingual.filter(c => c.start < dur).map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(Math.min(c.end, dur))}\n${c.who === 'Narrator' ? '' : (lang === 'vi' && c.who === 'Mom' ? 'Mẹ' : c.who) + ': '}${c[lang]}\n`).join('\n'));
console.log(JSON.stringify({ output: outFile, seconds: dur, frames, loudness_before: m.input_i, sfx: nFx }));
