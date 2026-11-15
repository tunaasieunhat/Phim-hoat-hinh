// Contact sheet of chosen times through the skill's own painter (captions included), for composition review.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const SK = '/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/scripts/';
const require = createRequire(SK + '../package.json');
const { createCanvas } = require('@napi-rs/canvas');
const { loadProject } = await import(SK + 'autopilot-core.mjs');
const { painter } = await import(SK + 'autopilot-render.mjs');
const [proj, out, ...ts] = process.argv.slice(2);
const p = loadProject(proj), draw = await painter(p);
const tw = 270, th = Math.round(tw * p.height / p.width), cols = 6, rows = Math.ceil(ts.length / cols);
const sheet = createCanvas(cols * (tw + 6), rows * (th + 26)), g = sheet.getContext('2d');
g.fillStyle = '#333'; g.fillRect(0, 0, sheet.width, sheet.height);
ts.forEach((t, i) => {
  const c = draw(+t, {}); const x = (i % cols) * (tw + 6), y = Math.floor(i / cols) * (th + 26);
  g.drawImage(c, x, y + 20, tw, th); g.fillStyle = '#fff'; g.font = '16px sans-serif'; g.fillText(`${(+t).toFixed(2)}s`, x + 4, y + 15);
});
fs.writeFileSync(out, sheet.toBuffer('image/jpeg'));
console.log('sheet', out);
