// Hand-drawn B1 line-art kit, drawn in code (no image-generation service).
// Fine slightly irregular black pen, hollow round heads, black oval eyes, expressive brows/mouths,
// single-line slender limbs, small oval hands/feet; props with cream/red/yellow crayon accents.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/package.json');
const { createCanvas } = require('@napi-rs/canvas');

export const INK = '#191916';
export const C = { cream: '#f7ecc4', paper: '#fffdf5', red: '#e2483d', yellow: '#f3c94c', green: '#8cc084', blue: '#9cc3de', navy: '#2c3e63', pink: '#f2a6b3', grey: '#c9c6bf', teal: '#4aa79c', brown: '#b8875a', white: '#ffffff' };
export const SCALE = 1.5;   // PNG pixels per design unit

let seed = 1;
export const reseed = (s) => { seed = s; };
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const jit = (a) => (rnd() - 0.5) * 2 * a;

export function canvas(w, h) {
  const cv = createCanvas(Math.round(w * SCALE), Math.round(h * SCALE));
  const ctx = cv.getContext('2d'); ctx.scale(SCALE, SCALE); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return { cv, ctx, w, h };
}
export function save(c, file) { fs.writeFileSync(file, c.cv.toBuffer('image/png')); return { file, w: c.w, h: c.h }; }

// resample a polyline so the wobble is even
function dense(P, step = 6) {
  const out = [P[0]];
  for (let i = 1; i < P.length; i++) {
    const [ax, ay] = P[i - 1], [bx, by] = P[i], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 1; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]);
  }
  return out;
}
// a pen line: slight wobble, slightly uneven pressure (two passes)
export function pen(ctx, P, o = {}) {
  const w = o.w ?? 4.2, col = o.color ?? INK, amt = o.amt ?? 0.9;
  const D = dense(P, 7);
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = pass ? w * 0.55 : w; ctx.globalAlpha = pass ? 0.55 : 1;
    D.forEach(([x, y], i) => { const X = x + jit(amt), Y = y + jit(amt); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    if (o.close) ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
export const ell = (cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
export function circle(ctx, cx, cy, r, o = {}) { if (o.fill) fillPath(ctx, ell(cx, cy, r, r), o.fill); pen(ctx, ell(cx, cy, r, r, 0, Math.PI * 2 + 0.15), o); }
export function oval(ctx, cx, cy, rx, ry, o = {}) { if (o.fill) fillPath(ctx, ell(cx, cy, rx, ry), o.fill); pen(ctx, ell(cx, cy, rx, ry, 0, Math.PI * 2 + 0.12), o); }
export function dot(ctx, x, y, rx, ry = rx, col = INK) { ctx.beginPath(); ctx.fillStyle = col; ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
// a crayon-ish fill: flat colour plus a few diagonal strokes
export function fillPath(ctx, P, col, o = {}) {
  ctx.save(); ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  ctx.fillStyle = col; ctx.globalAlpha = o.alpha ?? 0.92; ctx.fill(); ctx.clip();
  if (o.crayon !== false) { const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]); ctx.globalAlpha = 0.18; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = Math.min(...xs) - 200; x < Math.max(...xs); x += 9) { ctx.moveTo(x, Math.max(...ys)); ctx.lineTo(x + 200, Math.min(...ys)); } ctx.stroke(); }
  ctx.restore();
}
export function shape(ctx, P, fill, o = {}) { if (fill) fillPath(ctx, P, fill, o); pen(ctx, [...P, P[0]], o); }
export function rectP(x, y, w, h, r = 6) { return [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]]; }
export function text(ctx, s, x, y, size, col = INK, o = {}) { ctx.save(); ctx.font = `${o.weight ?? 400} ${size}px "Patrick Hand"`; ctx.fillStyle = col; ctx.textAlign = o.align ?? 'left'; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.fillText(s, 0, 0); ctx.restore(); }

// ---------------------------------------------------------------- the stick figure
// Angles in degrees: 0 = straight down, 90 = towards +x, 180 = up, -90 = towards -x.
const P2 = (x, y, ang, L) => [x + Math.sin(ang * Math.PI / 180) * L, y + Math.cos(ang * Math.PI / 180) * L];
export function face(ctx, x, y, r, f = {}) {
  const look = f.look ?? 0, ex = r * 0.34, ey = y - r * 0.05;
  const eyes = f.eyes ?? 'open';
  for (const s of [-1, 1]) {
    const cx = x + s * ex + look * r * 0.18;
    if (eyes === 'open') dot(ctx, cx, ey, r * 0.11, r * 0.15);
    else if (eyes === 'wide') { oval(ctx, cx, ey, r * 0.17, r * 0.21, { w: 2.6, fill: '#fff' }); dot(ctx, cx + look * 2, ey + 1, r * 0.08, r * 0.1); }
    else if (eyes === 'half') { dot(ctx, cx, ey + r * 0.05, r * 0.11, r * 0.07); pen(ctx, [[cx - r * 0.15, ey - r * 0.02], [cx + r * 0.15, ey - r * 0.02]], { w: 3 }); }
    else if (eyes === 'closed') pen(ctx, ell(cx, ey - r * 0.02, r * 0.13, r * 0.08, 0.15, Math.PI - 0.15, 8), { w: 3 });
    else if (eyes === 'happy') pen(ctx, ell(cx, ey + r * 0.06, r * 0.13, r * 0.11, Math.PI + 0.2, Math.PI * 2 - 0.2, 8), { w: 3.2 });
    else if (eyes === 'squint') pen(ctx, [[cx - r * 0.14, ey - s * 0], [cx + r * 0.14, ey + r * 0.04]], { w: 3.4 });
    // brows
    const b = f.brows ?? 'flat', by = ey - r * 0.3;
    if (b === 'up') pen(ctx, [[cx - r * 0.15, by - r * 0.08], [cx + r * 0.15, by - r * 0.12]], { w: 3 });
    else if (b === 'worried') pen(ctx, [[cx - s * r * 0.17, by + r * 0.02], [cx + s * r * 0.13, by - r * 0.1]], { w: 3 });
    else if (b === 'angry') pen(ctx, [[cx - s * r * 0.17, by - r * 0.1], [cx + s * r * 0.13, by + r * 0.04]], { w: 3.2 });
    else if (b === 'flat') pen(ctx, [[cx - r * 0.14, by], [cx + r * 0.14, by - r * 0.02]], { w: 2.8 });
  }
  const m = f.mouth ?? 'smile', my = y + r * 0.38, mx = x + look * r * 0.15;
  if (m === 'smile') pen(ctx, ell(mx, my - r * 0.1, r * 0.22, r * 0.14, 0.3, Math.PI - 0.3, 10), { w: 3 });
  else if (m === 'grin') { const G = [...ell(mx, my - r * 0.12, r * 0.3, r * 0.26, 0.05, Math.PI - 0.05, 14)]; shape(ctx, G, '#fff', { w: 3 }); pen(ctx, [[mx - r * 0.28, my - r * 0.05], [mx + r * 0.28, my - r * 0.05]], { w: 2 }); }
  else if (m === 'o') oval(ctx, mx, my, r * 0.1, r * 0.14, { w: 3, fill: INK });
  else if (m === 'scream') shape(ctx, ell(mx, my, r * 0.2, r * 0.24), '#5a2a28', { w: 3 });
  else if (m === 'frown') pen(ctx, ell(mx, my + r * 0.08, r * 0.2, r * 0.12, Math.PI + 0.35, Math.PI * 2 - 0.35, 10), { w: 3 });
  else if (m === 'wavy') pen(ctx, [[mx - r * 0.25, my], [mx - r * 0.12, my - r * 0.06], [mx, my], [mx + r * 0.12, my - r * 0.06], [mx + r * 0.25, my]], { w: 3 });
  else if (m === 'chomp') { shape(ctx, ell(mx, my, r * 0.24, r * 0.2), '#5a2a28', { w: 3 }); pen(ctx, [[mx - r * 0.2, my - r * 0.07], [mx + r * 0.2, my - r * 0.07]], { w: 2, color: '#fff' }); }
  else if (m === 'flat') pen(ctx, [[mx - r * 0.18, my], [mx + r * 0.18, my + r * 0.02]], { w: 3 });
  if (f.sweat) for (const [dx, dy] of f.sweat) shape(ctx, [[x + dx * r, y + dy * r - 9], [x + dx * r + 6, y + dy * r + 4], [x + dx * r, y + dy * r + 9], [x + dx * r - 6, y + dy * r + 4]], C.blue, { w: 2 });
  if (f.blush) for (const s of [-1, 1]) dot(ctx, x + s * r * 0.5, y + r * 0.22, r * 0.12, r * 0.07, 'rgba(226,72,61,0.35)');
  if (f.tear) shape(ctx, [[x - ex, ey + r * 0.15], [x - ex + 5, ey + r * 0.3], [x - ex, ey + r * 0.38], [x - ex - 5, ey + r * 0.3]], C.blue, { w: 2 });
}
export function head(ctx, x, y, r, f = {}) {
  circle(ctx, x, y, r, { w: 4.4, fill: f.fill ?? '#fffdf8' });
  const hair = f.hair ?? 'tuft';
  if (hair === 'tuft') { pen(ctx, [[x - 6, y - r + 2], [x - 12, y - r - 14]], { w: 3.4 }); pen(ctx, [[x + 2, y - r], [x + 2, y - r - 16]], { w: 3.4 }); pen(ctx, [[x + 9, y - r + 2], [x + 17, y - r - 12]], { w: 3.4 }); }
  if (hair === 'messy') for (let i = -4; i <= 4; i++) { const a = -Math.PI / 2 + i * 0.22; pen(ctx, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + 18 + (i % 2) * 8), y + Math.sin(a) * (r + 18 + (i % 2) * 8)]], { w: 3.2 }); }
  if (hair === 'bun') { circle(ctx, x + r * 0.5, y - r * 0.95, r * 0.32, { w: 3.6, fill: '#e9e3d6' }); pen(ctx, ell(x, y - r * 0.2, r * 0.95, r * 0.75, Math.PI + 0.2, Math.PI * 2 - 0.2, 14), { w: 3 }); }
  if (hair === 'bald') {}
  if (f.glasses) { circle(ctx, x - r * 0.34, y - r * 0.05, r * 0.24, { w: 2.6 }); circle(ctx, x + r * 0.34, y - r * 0.05, r * 0.24, { w: 2.6 }); pen(ctx, [[x - r * 0.1, y - r * 0.08], [x + r * 0.1, y - r * 0.08]], { w: 2.4 }); }
  face(ctx, x, y, r, f);
}
// fig: x,y = hip. o: lean (deg, + leans towards +x), arms {L:[upper,lower], R:[...]}, legs {L:[thigh,shin], R:[...]},
// r head radius, face, hair, steth (stethoscope), coat (thin open lab-coat lines), badge
export function figure(ctx, x, y, o = {}) {
  const s = o.s ?? 1, r = 41 * s, T = 128 * s, UA = 64 * s, LA = 62 * s, TH = 78 * s, SH = 76 * s;
  const lean = o.lean ?? 0;
  const neck = P2(x, y, 180 + lean, T), hc = P2(neck[0], neck[1], 180 + lean + (o.tilt ?? 0), r + 10 * s);
  const legs = o.legs ?? { L: [-12, -4], R: [12, 4] }, arms = o.arms ?? { L: [-20, -10], R: [20, 10] };
  const out = { neck, head: hc, hands: {}, feet: {} };
  // legs
  for (const k of ['L', 'R']) {
    if (o.noLegs) break;
    const kn = P2(x, y, legs[k][0], TH), ft = P2(kn[0], kn[1], legs[k][1], SH);
    pen(ctx, [[x, y], kn, ft], { w: 4.4 });
    const fd = (o.feetDir ?? (k === 'L' ? -1 : 1));
    oval(ctx, ft[0] + fd * 9 * s, ft[1] + 2, 13 * s, 6 * s, { w: 3, fill: '#fffdf8' });
    out.feet[k] = ft;
  }
  // lab coat: two thin flaps from the shoulders to below the hips (lines, not a filled torso)
  if (o.coat) {
    const sh = P2(neck[0], neck[1], lean, 14 * s);
    for (const sd of [-1, 1]) pen(ctx, [[sh[0] + sd * 10 * s, sh[1]], [sh[0] + sd * 30 * s + Math.sin(lean * Math.PI / 180) * 60 * s, y + 40 * s]], { w: 2.6, color: '#7f8a93' });
    pen(ctx, [[x - 30 * s, y + 40 * s], [x + 30 * s, y + 40 * s]], { w: 2.2, color: '#7f8a93' });
  }
  // torso
  pen(ctx, [[x, y], neck], { w: 4.6 });
  // stethoscope: a red U on the chest with a small round chest piece
  if (o.steth) {
    const a = P2(neck[0], neck[1], lean, 6 * s), b = P2(neck[0], neck[1], lean, 70 * s);
    pen(ctx, [[a[0] - 16 * s, a[1]], [b[0] - 14 * s, b[1]], [b[0], b[1] + 12 * s], [b[0] + 14 * s, b[1]], [a[0] + 16 * s, a[1]]], { w: 3.4, color: C.red });
    circle(ctx, b[0] + 2 * s, b[1] + 26 * s, 8 * s, { w: 2.6, fill: '#d9dde0' });
    pen(ctx, [[b[0], b[1] + 12 * s], [b[0] + 2 * s, b[1] + 18 * s]], { w: 2.6, color: C.red });
  }
  if (o.badge) { const b = P2(neck[0], neck[1], lean, 50 * s); shape(ctx, rectP(b[0] + 10 * s, b[1], 22 * s, 28 * s, 3), '#fff', { w: 2.4 }); pen(ctx, [[b[0] + 14 * s, b[1] + 10 * s], [b[0] + 28 * s, b[1] + 10 * s]], { w: 1.8, color: C.red }); }
  // arms (skip one to draw it as its own movable layer)
  const sh = P2(neck[0], neck[1], lean, 12 * s);
  for (const k of ['L', 'R']) {
    if (o.skipArm === k) { out.shoulder = sh; continue; }
    const el = P2(sh[0], sh[1], arms[k][0], UA), hd = P2(el[0], el[1], arms[k][1], LA);
    pen(ctx, [sh, el, hd], { w: 4.2 });
    oval(ctx, hd[0], hd[1], 9 * s, 7.5 * s, { w: 3, fill: '#fffdf8' });
    out.hands[k] = hd;
  }
  out.shoulder = sh;
  head(ctx, hc[0], hc[1], r, { ...(o.face ?? {}), hair: o.hair ?? 'tuft', glasses: o.glasses });
  return out;
}
// a single arm drawn alone (for a rotating arm layer): from (x,y) with angles
export function armOnly(ctx, x, y, a1, a2, s = 1) {
  const el = P2(x, y, a1, 64 * s), hd = P2(el[0], el[1], a2, 62 * s);
  pen(ctx, [[x, y], el, hd], { w: 4.2 }); oval(ctx, hd[0], hd[1], 9 * s, 7.5 * s, { w: 3, fill: '#fffdf8' });
  return hd;
}
export { P2 };
