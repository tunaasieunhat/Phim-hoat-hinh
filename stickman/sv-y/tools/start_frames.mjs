// Export clean start frames (no headings, labels or captions) for Google Flow "Frames to Video".
import fs from 'node:fs';
import path from 'node:path';
const SK = '/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/scripts/';
const { loadProject } = await import(SK + 'autopilot-core.mjs');
const { painter } = await import(SK + 'autopilot-render.mjs');
const ROOT = '/home/user/Phim-hoat-hinh/stickman/sv-y', OUT = path.join(ROOT, 'flow', 'start-frames');
fs.mkdirSync(OUT, { recursive: true });
const proj = JSON.parse(fs.readFileSync(path.join(ROOT, 'project.json'), 'utf8'));
proj.captions = [{ start: 55.0, end: 55.2, text: '.' }];   // the loader needs one cue; none falls on an exported time
for (const s of proj.shots) {
  const drop = new Set(s.layers.filter((l) => l.type === 'text').map((l) => l.id));
  s.layers = s.layers.filter((l) => !drop.has(l.id));
  s.portrait.regions = s.portrait.regions.map((r) => ({ ...r, layer_ids: r.layer_ids.filter((i) => !drop.has(i)) })).filter((r) => r.layer_ids.length);
}
const tmp = path.join(ROOT, '.flow-frames.json');
fs.writeFileSync(tmp, JSON.stringify(proj));
try {
  const p = loadProject(tmp), draw = await painter(p);
  const clips = { 'clip1-alarm': 0.2, 'clip2-rounds': 9.9, 'clip3-anatomy': 19.1, 'clip4-lunch': 26.5, 'clip5-patient': 36.7, 'clip6-midnight': 46.2 };
  for (const [name, t] of Object.entries(clips)) fs.writeFileSync(path.join(OUT, name + '.png'), draw(t, {}).toBuffer('image/png'));
  console.log('wrote', Object.keys(clips).length, 'frames to', OUT);
} finally { fs.rmSync(tmp, { force: true }); }
