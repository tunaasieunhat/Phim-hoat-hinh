// Measure every text layer's actual painted ink with the skill's own renderer (design units), over its keyed motion.
import fs from 'node:fs';
const SK = '/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/scripts/';
const { loadProject } = await import(SK + 'autopilot-core.mjs');
const { painter } = await import(SK + 'autopilot-render.mjs');
const proj = process.argv[2];
const p = loadProject(proj);
const draw = await painter(p);
const scale = p.width / 1280, out = {};
const px = (t, o) => Buffer.from(draw(t, o).data());
for (const shot of p.shots) for (const L of shot.layers) {
  if (L.type !== 'text') continue;
  const ts = [L.from ?? 0, ...(L.keys || []).map((k) => k.t)].filter((t) => t >= 0 && t < shot.end - shot.start).slice(0, 40);
  let b = null;
  for (const lt of ts) {
    const t = shot.start + lt + 0.001, a = px(t, { focusIds: [L.id] }), z = px(t, { focusIds: ['__none__'] });
    for (let y = 0, i = 0; y < p.height; y++) for (let x = 0; x < p.width; x++, i += 4) {
      if (Math.abs(a[i] - z[i]) <= 8 && Math.abs(a[i + 1] - z[i + 1]) <= 8 && Math.abs(a[i + 2] - z[i + 2]) <= 8) continue;
      b = b ? [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)] : [x, y, x, y];
    }
  }
  if (b) out[L.id] = b.map((v) => +(v / scale).toFixed(1));
}
fs.writeFileSync(new URL('../art/text-ink.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'text layers measured');
