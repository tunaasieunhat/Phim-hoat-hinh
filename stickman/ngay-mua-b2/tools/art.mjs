// Story artwork for "Rainy day: plan vs. reality" in the directing-stickman-videos B2 style (Colorful Hand-Drawn),
// drawn entirely in code: warm paper, irregular fine ink contours, muted flat colours, round-headed stickmen.
// Every layer is a separate PNG on the runtime's 1280-wide portrait design plane (1280 × 2276).
// usage: node tools/art.mjs   (writes art/*.png)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const SKILL = '/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos';
const require = createRequire(path.join(SKILL, 'package.json'));
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'art');
GlobalFonts.registerFromPath('/home/user/Phim-hoat-hinh/video/public/fonts/PatrickHand-Regular.ttf', 'Hand');
GlobalFonts.registerFromPath(path.join(SKILL, 'assets/fonts/NotoSans.ttf'), 'Noto');

export const W = 1280, H = 2276;
const INK = '#38352f', PAPER = '#f4f0e5';
// deterministic jitter so redraws are identical
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = (a = 1.6) => (rnd() - 0.5) * 2 * a;

function canvas(w = W, h = H) { const c = createCanvas(w, h); const x = c.getContext('2d'); x.lineCap = 'round'; x.lineJoin = 'round'; return [c, x]; }
// layers are trimmed to their painted pixels; offsets.json records where each one sits on the design plane
const OFFSETS = {};
function save(c, name, { trim = true, at = [0, 0] } = {}) {
  let out = c, ox = 0, oy = 0;
  if (trim) {
    const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) if (d[(yy * c.width + xx) * 4 + 3] > 8) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
    if (x1 >= 0) { x0 = Math.max(0, x0 - 4); y0 = Math.max(0, y0 - 4); x1 = Math.min(c.width - 1, x1 + 4); y1 = Math.min(c.height - 1, y1 + 4);
      const t = createCanvas(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(c, -x0, -y0); out = t; ox = x0; oy = y0; }
  }
  OFFSETS[name] = { x: ox + at[0], y: oy + at[1], w: out.width, h: out.height };
  fs.writeFileSync(path.join(OUT, name), out.toBuffer('image/png'));
}

// a hand-inked polyline/polygon: slightly wobbly, drawn twice with a thin offset for an irregular nib
function ink(x, pts, { close = false, fill = null, width = 4, color = INK, wob = 1.4 } = {}) {
  const P = pts.map(([a, b]) => [a + j(wob), b + j(wob)]);
  const pathTo = (Q) => { x.beginPath(); x.moveTo(...Q[0]); for (let i = 1; i < Q.length; i++) { const [a, b] = Q[i - 1], [c, d] = Q[i]; x.quadraticCurveTo(a + j(wob * .6), b + j(wob * .6), (a + c) / 2, (b + d) / 2); x.lineTo(c, d); } if (close) x.closePath(); };
  if (fill) { pathTo(P); x.fillStyle = fill; x.fill(); }
  if (width > 0) { pathTo(P); x.strokeStyle = color; x.lineWidth = width; x.stroke(); pathTo(P.map(([a, b]) => [a + j(.8), b + j(.8)])); x.lineWidth = width * .45; x.globalAlpha = .55; x.stroke(); x.globalAlpha = 1; }
}
const rectPts = (x0, y0, w, h, n = 3) => { const p = []; for (let i = 0; i <= n; i++) p.push([x0 + w * i / n, y0]); for (let i = 1; i <= n; i++) p.push([x0 + w, y0 + h * i / n]); for (let i = 1; i <= n; i++) p.push([x0 + w - w * i / n, y0 + h]); for (let i = 1; i < n; i++) p.push([x0, y0 + h - h * i / n]); return p; };
const circlePts = (cx, cy, r, n = 28, ry = r) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * Math.PI * 2) * r, cy + Math.sin(i / n * Math.PI * 2) * ry]);
function paperTexture(x, w, h, base, speck = 'rgba(120,100,70,.06)') {
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let i = 0; i < w * h / 900; i++) { x.fillStyle = speck; x.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
}
function hatch(x, x0, y0, w, h, color = 'rgba(56,53,47,.12)', gap = 14) {
  x.save(); x.beginPath(); x.rect(x0, y0, w, h); x.clip(); x.strokeStyle = color; x.lineWidth = 2;
  for (let k = -h; k < w; k += gap) { x.beginPath(); x.moveTo(x0 + k + j(), y0 + h + j()); x.lineTo(x0 + k + h + j(), y0 + j()); x.stroke(); }
  x.restore();
}

// ---------- palettes: PLAN (warm, saturated) vs REALITY (cold, grey-blue, desaturated) ----------
export const PLAN = { wall: '#f3e3c9', wall2: '#ecd4b0', floor: '#d9b48a', board: 'rgba(120,80,40,.25)', curtain: '#e39b8a', rug: '#e8b04f', cushion: '#d9727c', plant: '#7fa66b', wood: '#b07d52', mug: '#f1c6c0', lamp: '#f6d27a' };
export const REAL = { wall: '#b9bec4', wall2: '#a9afb7', floor: '#8d939b', board: 'rgba(40,45,55,.22)', curtain: '#8f99a6', rug: '#9aa1a8', cushion: '#7f8893', plant: '#7c8b80', wood: '#7d7f84', mug: '#c9ccd1', lamp: '#c8c8c0' };

// ---------- the room (transparent window glass so the outside layers show through) ----------
const WIN = { x: 560, y: 600, w: 460, h: 500 };
export { WIN };
function room(pal, { lights = false, nightstand = true } = {}) {
  const [c, x] = canvas();
  paperTexture(x, W, H, pal.wall);
  // wallpaper stripes, very faint
  for (let k = 0; k < W; k += 90) { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(k, 0, 40, 1640); }
  // floor boards
  x.fillStyle = pal.floor; x.fillRect(0, 1640, W, H - 1640);
  ink(x, [[0, 1640], [W, 1636]], { width: 4 });
  for (let k = 1700; k < H; k += 70) ink(x, [[0, k], [W, k + j(4)]], { width: 2, color: pal.board, wob: 2 });
  // window: frame + sill, glass cut out
  x.clearRect(WIN.x, WIN.y, WIN.w, WIN.h);
  ink(x, rectPts(WIN.x - 18, WIN.y - 18, WIN.w + 36, WIN.h + 36), { close: true, width: 5 });
  x.fillStyle = '#efe7d6'; x.fillRect(WIN.x - 18, WIN.y - 18, WIN.w + 36, 18); x.fillRect(WIN.x - 18, WIN.y + WIN.h, WIN.w + 36, 18); x.fillRect(WIN.x - 18, WIN.y, 18, WIN.h); x.fillRect(WIN.x + WIN.w, WIN.y, 18, WIN.h);
  x.fillRect(WIN.x + WIN.w / 2 - 7, WIN.y, 14, WIN.h); x.fillRect(WIN.x, WIN.y + WIN.h / 2 - 7, WIN.w, 14);
  ink(x, [[WIN.x + WIN.w / 2, WIN.y], [WIN.x + WIN.w / 2, WIN.y + WIN.h]], { width: 3 });
  ink(x, [[WIN.x, WIN.y + WIN.h / 2], [WIN.x + WIN.w, WIN.y + WIN.h / 2]], { width: 3 });
  ink(x, rectPts(WIN.x - 40, WIN.y + WIN.h + 18, WIN.w + 80, 26), { close: true, fill: '#e9dcc4', width: 4 });
  if (lights) { ink(x, [[WIN.x - 60, WIN.y - 40], [WIN.x + 120, WIN.y + 10], [WIN.x + 260, WIN.y - 10], [WIN.x + 400, WIN.y + 14], [WIN.x + 560, WIN.y - 36]], { width: 2.5 }); }
  if (nightstand) {
    // a small shelf with books on the left wall
    ink(x, rectPts(90, 640, 300, 22), { close: true, fill: pal.wood, width: 4 });
    [['#c96f5a', 40], ['#5f8db3', 34], ['#e3b34f', 46], ['#7fa66b', 30]].forEach(([col, bw], i) => ink(x, rectPts(110 + i * 52, 640 - 110 + (i % 2) * 14, bw, 110 - (i % 2) * 14, 1), { close: true, fill: pal === REAL ? '#9aa1a8' : col, width: 3 }));
  }
  return [c, x];
}

// ---------- outside: grey sky with distant roofs; rain sheet; the cloud with a face ----------
function outside(dark = false) {
  const [c, x] = canvas(WIN.w, WIN.h);
  const g = x.createLinearGradient(0, 0, 0, WIN.h); g.addColorStop(0, dark ? '#6f7a88' : '#93a0ae'); g.addColorStop(1, dark ? '#8a94a0' : '#b6c0c9'); x.fillStyle = g; x.fillRect(0, 0, WIN.w, WIN.h);
  [[0, 400, 160], [140, 360, 130], [250, 420, 170], [380, 380, 140]].forEach(([bx, by, bw]) => { ink(x, [[bx, WIN.h], [bx, by], [bx + bw / 2, by - 50], [bx + bw, by], [bx + bw, WIN.h]], { fill: dark ? '#5b6573' : '#7d8896', width: 3 }); });
  return c;
}
// a rain sheet that repeats every 120 px vertically, so sliding it down 120 px loops seamlessly
export const RAIN_P = 120;
function rainSheet() {
  const [c, x] = canvas(WIN.w, WIN.h + RAIN_P);
  x.strokeStyle = 'rgba(232,240,248,.75)'; x.lineWidth = 3;
  const tile = Array.from({ length: 14 }, () => [rnd() * WIN.w, rnd() * RAIN_P]);
  for (let k = -1; k * RAIN_P < WIN.h + RAIN_P; k++) for (const [a, b] of tile) { x.beginPath(); x.moveTo(a, b + k * RAIN_P); x.lineTo(a - 7, b + k * RAIN_P + 34); x.stroke(); }
  return c;
}
function cloud(mood) {
  const [c, x] = canvas(420, 300);
  ink(x, [[60, 210], [30, 170], [52, 120], [100, 108], [118, 62], [178, 42], [230, 66], [268, 38], [330, 58], [350, 108], [392, 126], [396, 182], [362, 214]], { close: true, fill: '#8a95a3', width: 5 });
  // face
  if (mood === 'sly') { ink(x, [[160, 140], [180, 132], [200, 140]], { width: 5 }); ink(x, [[240, 140], [260, 132], [280, 140]], { width: 5 }); }
  else { x.fillStyle = INK; [[178, 140], [262, 140]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 8, 0, 7); x.fill(); }); }
  ink(x, mood === 'sly' ? [[180, 178], [220, 196], [262, 176]] : [[188, 176], [220, 192], [252, 176]], { width: 5 });
  // drops under it
  x.fillStyle = '#6f9cc7'; [[110, 250], [180, 270], [250, 248], [320, 266]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b - 18); x.quadraticCurveTo(a + 12, b, a, b + 8); x.quadraticCurveTo(a - 12, b, a, b - 18); x.fill(); });
  return c;
}
function curtain(pal, side) {
  const [c, x] = canvas(230, 660);
  const pts = side < 0 ? [[10, 10], [220, 10], [204, 220], [222, 440], [196, 650], [10, 650]] : [[10, 10], [220, 10], [220, 650], [34, 650], [8, 440], [26, 220]];
  ink(x, pts, { close: true, fill: pal.curtain, width: 4 });
  for (let k = 0; k < 3; k++) ink(x, [[50 + k * 55, 30], [50 + k * 55 + j(6), 620]], { width: 2, color: 'rgba(56,53,47,.3)', wob: 3 });
  return c;
}

// ---------- Lily: round white head, dot eyes, short line mouth, dark bob, muted pink hoodie ----------
// pose angles (degrees): 0 = down, positive = towards +x (the figure faces right)
function lily(x, { cx = 300, ground = 1610, aL = [-15, -5], aR = [15, 5], lL = [-8, -2], lR = [8, 2], sit = false, lean = 0, look = 0.4, eyes = 'dot', mouth = 'line', brows = null, hoodie = '#d98c9a', blush = false, tilt = 0 } = {}) {
  const S = 1.25, pt = (a, b, ang, len) => [a + Math.sin(ang * Math.PI / 180) * len * S, b + Math.cos(ang * Math.PI / 180) * len * S];
  const hip = sit ? [cx, ground - 46 * S] : [cx, ground - 172 * S];
  const neck = pt(...hip, 180 + lean, 138), head = pt(...neck, 180 + lean + tilt, 50);
  // legs
  const leg = ([t, s], side) => { const k = pt(...hip, t, 84), f = pt(...k, s, 84); ink(x, [hip, k, f], { width: 8 }); ink(x, [[f[0] - 4, f[1]], [f[0] + 22, f[1] + 2]], { width: 9 }); };
  leg(lL, -1); leg(lR, 1);
  // hoodie body
  const sh = pt(...hip, 180 + lean, 126);
  ink(x, [[sh[0] - 40, sh[1] + 6], [sh[0] + 40, sh[1] + 6], [hip[0] + 46, hip[1] + 18], [hip[0] - 46, hip[1] + 18]], { close: true, fill: hoodie, width: 4 });
  ink(x, [[hip[0] - 26, hip[1] - 26], [hip[0] + 26, hip[1] - 26], [hip[0] + 22, hip[1] - 2], [hip[0] - 22, hip[1] - 2]], { close: true, width: 2.5, color: 'rgba(56,53,47,.55)' });
  // arms (sleeves = thick pink line under a thin ink line), hands
  const arm = ([u, f]) => { const s0 = [sh[0], sh[1] + 10], e = pt(...s0, u, 70), h = pt(...e, f, 64); x.strokeStyle = hoodie; x.lineWidth = 22; x.beginPath(); x.moveTo(...s0); x.lineTo(...e); x.lineTo(...h); x.stroke(); ink(x, [s0, e, h], { width: 3.5 }); ink(x, circlePts(h[0], h[1], 11, 12), { close: true, fill: '#fffaf0', width: 3 }); return h; };
  const hl = arm(aL), hr = arm(aR);
  // head + hair (bob)
  const r = 58, [hx, hy] = head;
  ink(x, circlePts(hx, hy, r), { close: true, fill: '#fffaf0', width: 4.5 });
  x.save(); x.translate(hx, hy); x.rotate((lean + tilt) * Math.PI / 180);
  x.fillStyle = '#4a3427'; x.beginPath(); x.moveTo(-r - 6, 14); x.quadraticCurveTo(-r - 10, -r - 12, 0, -r - 8); x.quadraticCurveTo(r + 10, -r - 12, r + 6, 14); x.quadraticCurveTo(r * .4, -r * .45, -r * .2, -r * .5); x.quadraticCurveTo(-r * .7, -r * .4, -r - 6, 14); x.fill();
  const lx = look * r * .3;
  if (eyes === 'dot') { x.fillStyle = INK; [-1, 1].forEach(s => { x.beginPath(); x.arc(s * r * .32 + lx, 2, 5.5, 0, 7); x.fill(); }); }
  else if (eyes === 'closed') [-1, 1].forEach(s => ink(x, [[s * r * .32 + lx - 10, 2], [s * r * .32 + lx, 8], [s * r * .32 + lx + 10, 2]], { width: 3.5 }));
  else if (eyes === 'happy') [-1, 1].forEach(s => ink(x, [[s * r * .32 + lx - 10, 6], [s * r * .32 + lx, -3], [s * r * .32 + lx + 10, 6]], { width: 3.5 }));
  else if (eyes === 'tired') [-1, 1].forEach(s => { ink(x, [[s * r * .32 + lx - 11, -2], [s * r * .32 + lx + 11, -1]], { width: 3.5 }); x.fillStyle = INK; x.beginPath(); x.arc(s * r * .32 + lx, 4, 4.5, 0, 7); x.fill(); });
  if (brows === 'determined') [-1, 1].forEach(s => ink(x, [[s * r * .32 + lx - s * 12, -22], [s * r * .32 + lx + s * 10, -14]], { width: 4 }));
  if (mouth === 'line') ink(x, [[lx - 9, 26], [lx + 9, 26]], { width: 3.5 });
  else if (mouth === 'smile') ink(x, [[lx - 12, 22], [lx, 30], [lx + 12, 22]], { width: 3.5 });
  else if (mouth === 'open') { x.fillStyle = '#7a3b34'; x.beginPath(); x.ellipse(lx, 28, 10, 12, 0, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 3; x.stroke(); }
  else if (mouth === 'yawn') { x.fillStyle = '#7a3b34'; x.beginPath(); x.ellipse(lx, 30, 9, 15, 0, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 3; x.stroke(); }
  if (blush) { x.fillStyle = 'rgba(217,114,124,.45)'; [-1, 1].forEach(s => { x.beginPath(); x.ellipse(s * r * .55 + lx, 18, 11, 6, 0, 0, 7); x.fill(); }); }
  x.restore();
  return { head, hl, hr, hip, sh };
}

function book(x, cx, cy, { ang = -0.25, cover = '#c96f5a', open = true, s = 1 } = {}) {
  x.save(); x.translate(cx, cy); x.rotate(ang); x.scale(s, s);
  if (open) { ink(x, [[-90, 0], [-4, -16], [0, 0]], { close: true, fill: '#fffaf0', width: 3.5 }); ink(x, [[0, 0], [4, -16], [90, 0]], { close: true, fill: '#fffaf0', width: 3.5 }); ink(x, [[-94, 4], [0, 8], [94, 4], [94, 14], [0, 18], [-94, 14]], { close: true, fill: cover, width: 3.5 }); [-70, -50, -30].forEach(a => ink(x, [[a, -5], [a + 50, -12]], { width: 1.5, color: 'rgba(56,53,47,.4)' })); }
  else ink(x, rectPts(-90, -16, 180, 28, 2), { close: true, fill: cover, width: 3.5 });
  x.restore();
}
function mug(x, cx, cy, col, steam = false) {
  ink(x, [[cx - 34, cy - 70], [cx + 34, cy - 70], [cx + 28, cy], [cx - 28, cy]], { close: true, fill: col, width: 4 });
  ink(x, [[cx + 32, cy - 54], [cx + 58, cy - 50], [cx + 56, cy - 22], [cx + 30, cy - 20]], { width: 4 });
  if (steam) [-12, 10].forEach(d => ink(x, [[cx + d, cy - 90], [cx + d - 10, cy - 116], [cx + d + 6, cy - 140], [cx + d - 6, cy - 166]], { width: 3, color: 'rgba(56,53,47,.45)' }));
}
function lowTable(x, pal, x0 = 800, top = 1470) {
  ink(x, rectPts(x0, top, 300, 24, 3), { close: true, fill: pal.wood, width: 4 });
  ink(x, [[x0 + 30, top + 24], [x0 + 24, 1640]], { width: 6 }); ink(x, [[x0 + 270, top + 24], [x0 + 276, 1640]], { width: 6 });
}
function cushion(x, pal, cx = 380) { ink(x, circlePts(cx, 1618, 190, 30, 38), { close: true, fill: pal.cushion, width: 4 }); }
function plant(x, pal, cx = 200) { ink(x, [[cx - 50, 1640], [cx - 60, 1540], [cx + 60, 1540], [cx + 50, 1640]], { close: true, fill: '#c98a5f', width: 4 }); [[-40, -220], [0, -280], [40, -230], [-70, -160], [70, -170]].forEach(([dx, dy]) => ink(x, [[cx, 1540], [cx + dx * .4, 1540 + dy * .5], [cx + dx, 1540 + dy], [cx + dx * .2 + 20, 1540 + dy * .6]], { close: true, fill: pal.plant, width: 3 })); }

function badge(kind) {
  const [c, x] = canvas(470, 200);
  const plan = kind === 'PLAN';
  ink(x, rectPts(20, 20, 420, 150, 4), { close: true, fill: plan ? '#f0c75e' : '#7f8893', width: 5 });
  x.font = '96px Hand'; x.textAlign = 'center'; x.fillStyle = plan ? INK : '#eef0f2'; x.fillText(kind, 230, 112);
  x.font = '40px Hand'; x.fillStyle = plan ? '#8a4b2a' : '#d5d9de'; x.fillText(plan ? 'Kế hoạch' : 'Thực tế', 230, 156);
  if (!plan) { x.fillStyle = '#6f9cc7'; x.beginPath(); x.moveTo(60, 70); x.quadraticCurveTo(80, 100, 60, 112); x.quadraticCurveTo(40, 100, 60, 70); x.fill(); }
  return c;
}
function heading(lines, w = 1100, h = 260) {
  // B2 handwritten heading: dark ink first line, terracotta second line
  const [c, x] = canvas(w, h);
  x.textAlign = 'center';
  lines.forEach(([t, size, col], i) => { x.font = `${size}px Hand`; x.fillStyle = col; x.fillText(t, w / 2, 90 + i * (size * 1.05)); });
  return c;
}
function planCard() {
  const [c, x] = canvas(560, 520);
  ink(x, rectPts(30, 40, 500, 450, 4), { close: true, fill: '#fbf6e9', width: 4 });
  ink(x, [[230, 26], [330, 26], [320, 60], [240, 60]], { close: true, fill: 'rgba(240,199,94,.85)', width: 2 });
  x.font = '64px Hand'; x.fillStyle = '#b4573e'; x.textAlign = 'center'; x.fillText("TODAY'S PLAN", 280, 130);
  x.textAlign = 'left'; x.font = '50px Hand'; x.fillStyle = INK;
  ['read a book', 'work out', 'clean my room', 'cook healthy'].forEach((t, i) => { ink(x, rectPts(70, 170 + i * 76, 38, 38, 1), { close: true, width: 3 }); x.fillText(t, 130, 204 + i * 76); });
  return c;
}
function sparkle(col = '#f0c75e') {
  const [c, x] = canvas(80, 80);
  ink(x, [[40, 4], [48, 32], [76, 40], [48, 48], [40, 76], [32, 48], [4, 40], [32, 32]], { close: true, fill: col, width: 3 });
  return c;
}
function zee(size = 70) { const [c, x] = canvas(90, 100); x.font = `${size}px Hand`; x.fillStyle = '#5b6573'; x.fillText('z', 18, 80); return c; }
function phoneFlash() { const [c, x] = canvas(W, H); x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H); return c; }
function steam() { const [c, x] = canvas(120, 160); [-14, 16].forEach(d => ink(x, [[60 + d, 150], [50 + d, 110], [66 + d, 70], [54 + d, 20]], { width: 4, color: 'rgba(56,53,47,.45)' })); return c; }

// ================= write the layers =================
fs.mkdirSync(OUT, { recursive: true });
save(outside(), 'outside.png', { trim: false, at: [WIN.x, WIN.y] });
save(outside(true), 'outside-dark.png', { trim: false, at: [WIN.x, WIN.y] });
save(rainSheet(), 'rain.png', { trim: false, at: [WIN.x, WIN.y - RAIN_P] });
save(cloud('grin'), 'cloud.png');
save(cloud('sly'), 'cloud-sly.png');
for (const [pal, tag] of [[PLAN, 'plan'], [REAL, 'real']]) { save(curtain(pal, -1), `curtain-l-${tag}.png`); save(curtain(pal, 1), `curtain-r-${tag}.png`); }
save(badge('PLAN'), 'badge-plan.png');
save(badge('REALITY'), 'badge-real.png');
save(planCard(), 'plan-card.png');
save(sparkle(), 'sparkle.png');
save(sparkle('#fbf6e9'), 'sparkle-white.png');
save(zee(), 'zee.png');
save(phoneFlash(), 'flash.png', { trim: false });
save(steam(), 'steam.png');
save(heading([['SATURDAY. 7:00 AM.', 92, INK], ['IT IS RAINING.', 104, '#b4573e']]), 'head-s1.png');
save(heading([['PLAN: READ A BOOK', 96, INK], ['Kế hoạch: đọc sách', 80, '#b4573e']]), 'head-s2-plan.png');

// scene 1 — bedroom, cool morning light (the room before any plan or reality)
{ const [c, x] = room(PLAN, { nightstand: false }); x.fillStyle = 'rgba(120,140,160,.12)'; x.fillRect(0, 0, W, H); save(c, 's1-room.png', { trim: false }); }
const fig = (opts, name) => { const [c, x] = canvas(); const r = lily(x, opts); save(c, name); return r; };
fig({ cx: 470, aL: [-15, -5], aR: [128, 150], look: 0.8, eyes: 'tired', mouth: 'yawn' }, 's1-lily-pull.png');
fig({ cx: 470, aL: [-15, -5], aR: [15, 5], look: 0.9, eyes: 'dot', mouth: 'line' }, 's1-lily-look.png');
fig({ cx: 470, aL: [-20, -10], aR: [40, 70], look: 0, eyes: 'dot', mouth: 'smile' }, 's1-lily-think.png');
fig({ cx: 470, aL: [-20, -10], aR: [160, 200], look: 0, eyes: 'dot', mouth: 'open', brows: 'determined' }, 's1-lily-fist.png');

// scene 2 PLAN — the picture-perfect reading corner (warm, saturated)
{ const [c, x] = room(PLAN, { lights: true }); plant(x, PLAN); lowTable(x, PLAN); cushion(x, PLAN); save(c, 's2-plan-room.png', { trim: false }); }
{ const [c, x] = canvas(); const r = lily(x, { cx: 380, sit: true, ground: 1600, lL: [92, 92], lR: [86, 94], aL: [60, 140], aR: [70, 150], look: 0.6, eyes: 'happy', mouth: 'smile', blush: true }); book(x, (r.hl[0] + r.hr[0]) / 2 + 8, (r.hl[1] + r.hr[1]) / 2 - 8, { cover: '#e3b34f' }); save(c, 's2-lily-read.png'); }
{ const [c, x] = canvas(240, 200); mug(x, 110, 190, PLAN.mug); save(c, 'mug-plan.png'); }
{ const [c, x] = canvas(240, 200); mug(x, 110, 190, REAL.mug); save(c, 'mug-real.png'); }
{ const [c, x] = canvas(700, 180); for (let i = 0; i < 7; i++) { x.fillStyle = ['#f6d27a', '#f1a7a0', '#a8d5a2'][i % 3]; x.beginPath(); x.arc(40 + i * 78, 60 + Math.sin(i) * 26, 13, 0, 7); x.fill(); } save(c, 'lights.png'); }
{ const [c, x] = canvas(700, 180); for (let i = 0; i < 7; i++) { x.fillStyle = 'rgba(255,240,190,.55)'; x.beginPath(); x.arc(40 + i * 78, 60 + Math.sin(i) * 26, 26, 0, 7); x.fill(); } save(c, 'lights-glow.png'); }

// scene 2 REALITY — the same corner, grey and cold
{ const [c, x] = room(REAL, { lights: true }); plant(x, REAL); lowTable(x, REAL); cushion(x, REAL); save(c, 's2-real-room.png', { trim: false }); }
{ const [c, x] = canvas(); const r = lily(x, { cx: 380, sit: true, ground: 1600, lL: [92, 92], lR: [86, 94], aL: [60, 140], aR: [70, 150], look: 0.6, eyes: 'tired', mouth: 'line', hoodie: '#b7848c' }); book(x, (r.hl[0] + r.hr[0]) / 2 + 8, (r.hl[1] + r.hr[1]) / 2 - 8, { cover: '#a99a72' }); save(c, 's2-lily-tired.png'); }
{ const [c, x] = canvas(); const r = lily(x, { cx: 380, sit: true, ground: 1600, lL: [92, 92], lR: [86, 94], aL: [60, 140], aR: [70, 150], look: 0.6, eyes: 'closed', mouth: 'yawn', hoodie: '#b7848c' }); book(x, (r.hl[0] + r.hr[0]) / 2 + 8, (r.hl[1] + r.hr[1]) / 2 - 8, { cover: '#a99a72' }); save(c, 's2-lily-yawn.png'); }
{ const [c, x] = canvas(); const r = lily(x, { cx: 380, sit: true, ground: 1600, lL: [92, 92], lR: [86, 94], aL: [70, 120], aR: [150, 205], look: -0.3, eyes: 'happy', mouth: 'smile', hoodie: '#b7848c' }); book(x, r.hl[0] + 30, r.hl[1] - 4, { cover: '#a99a72', ang: -0.5, s: 0.8 });
  x.save(); x.translate(r.hr[0], r.hr[1] - 40); x.rotate(-0.15); ink(x, rectPts(-34, -60, 68, 120, 2), { close: true, fill: '#3b3f46', width: 4 }); x.fillStyle = '#9aa1a8'; x.beginPath(); x.arc(0, -42, 8, 0, 7); x.fill(); x.restore(); save(c, 's2-lily-selfie.png'); }
{ const [c, x] = canvas(); const r = lily(x, { cx: 380, sit: true, ground: 1600, lean: 72, tilt: 14, lL: [92, 92], lR: [86, 94], aL: [-30, -10], aR: [40, 70], eyes: 'closed', mouth: 'open', hoodie: '#b7848c' });
  book(x, r.head[0] + 4, r.head[1] - 10, { cover: '#a99a72', ang: 0.15, open: true, s: 1.05 }); save(c, 's2-lily-sleep.png'); }
// page turning: three states of one page
for (const [k, f] of [[0, 0.2], [1, 0.5], [2, 0.8]]) { const [c, x] = canvas(240, 160); const a = Math.PI * f; ink(x, [[120, 130], [120 + 100 * Math.cos(a), 130 - 20 - 70 * Math.sin(a)], [120 + 8 * Math.cos(a), 112]], { close: true, fill: '#fffaf0', width: 3.5 }); save(c, `page-${k}.png`); }
// a counter chip for the photos
{ const [c, x] = canvas(300, 140); ink(x, rectPts(20, 20, 260, 100, 3), { close: true, fill: '#fbf6e9', width: 4 }); ink(x, rectPts(46, 44, 70, 52, 1), { close: true, fill: '#3b3f46', width: 3 }); x.fillStyle = '#fbf6e9'; x.beginPath(); x.arc(81, 70, 13, 0, 7); x.fill(); save(c, 'counter.png'); }
// the tear: the PLAN frame as it is at the rip, cut down a jagged line into two halves
{
  const { loadImage } = require('@napi-rs/canvas');
  const parts = ['s2-plan-room.png', 's2-lily-read.png'];
  const [c, x] = canvas();
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  const put = async (n, at) => { const o = at ?? OFFSETS[n]; x.drawImage(await loadImage(path.join(OUT, n)), o.x, o.y); };
  await put('outside.png'); await put('cloud.png', { x: WIN.x + 30, y: WIN.y + 60 });
  for (const p of parts) await put(p);
  await put('mug-plan.png', { x: 840, y: 1290 });
  await put('lights.png', { x: WIN.x - 60 + OFFSETS['lights.png'].x, y: WIN.y - 90 + OFFSETS['lights.png'].y });
  const L = [[640, -20], [600, 200], [680, 380], [590, 600], [700, 820], [610, 1040], [690, 1260], [600, 1480], [680, 1700], [620, 1940], [660, 2300]];
  for (const side of ['l', 'r']) {
    const [h, y] = canvas();
    y.save(); y.beginPath(); y.moveTo(side === 'l' ? -10 : W + 10, -20); L.forEach(p => y.lineTo(...p)); y.lineTo(side === 'l' ? -10 : W + 10, 2300); y.closePath(); y.clip(); y.drawImage(c, 0, 0); y.restore();
    y.strokeStyle = '#fbf6e9'; y.lineWidth = 12; y.beginPath(); y.moveTo(...L[0]); L.forEach(p => y.lineTo(...p)); y.stroke();
    save(h, `tear-${side}.png`, { trim: false });
  }
}
fs.writeFileSync(path.join(OUT, 'offsets.json'), JSON.stringify(OFFSETS, null, 1));
console.log('art written:', Object.keys(OFFSETS).length, 'layers');
