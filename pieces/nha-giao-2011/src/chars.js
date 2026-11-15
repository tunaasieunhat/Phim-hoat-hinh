// =====================================================================
//  CHARACTERS AND PROPS for "Tri ân thầy cô" — cut paper, built on the style kit (cut, ellipsePts, capsulePts, face ...)
//  Orange (PAL.orange) is reserved for the paper flower: gratitude. Never spend it elsewhere.
//  The hero's identity cue: teal hair clips (two pigtails as a child, one clip in her hair as an adult).
// =====================================================================
const C2 = {
  red: '#d8343a', redD: '#a8242a', starY: '#f7d23e', white: '#fbf8f0', shirt: '#f4f1ea', navyS: '#2c3a6e',
  aoMint: '#9fd6c4', aoBlue: '#8fb8e6', aoWhite: '#f7f4ec', aoTeal: '#3f9f9a', aoLilac: '#c7b6ea',
  hair: '#2a1f1b', clip: '#2fb3a8', chalk: '#f2efe4', board: '#2f5b4a', boardD: '#244738',
};

// the orange paper flower (the only orange in the piece). (x, y) = the flower head; stem goes down
function flower(x, y, s, key = 'fl', o = {}) {
  if (s <= 0.01) return;
  const sway = Math.sin(TT * 2.4 + key.length) * 0.06 + (o.rot ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway); ctx.scale(s, s);
  if (o.stem !== false) {
    ink([[0, 10], [4, 70], [0, 150]], { w: 9, color: PAL.greenD, key: key + 'st' });
    cut(rot(ellipsePts(26, 80, 30, 12, 0, 16), 4, 80, -0.5), PAL.green, { key: key + 'lf', sb: 4 });
  }
  for (let p = 0; p < 6; p++) {
    const a = p / 6 * TAU + 0.3;
    cut(rot(ellipsePts(Math.cos(a) * 30, Math.sin(a) * 30, 30, 20, 0, 18), Math.cos(a) * 30, Math.sin(a) * 30, a), PAL.orange, { key: key + 'p' + p, crayon: PAL.orangeD, crAl: 0.35, crPer: 28, sb: 5, sy: 3, tear: 0.8 });
  }
  cut(ellipsePts(0, 0, 17, 17, 0, 16), PAL.yellow, { key: key + 'c', shadow: false, crayon: PAL.mustard, crAl: 0.4 });
  ctx.restore();
}
const flowerPts = (x, y, s) => { const P = []; for (let i = 0; i < 96; i++) { const a = i / 96 * TAU; const r = (48 + 12 * Math.cos(6 * (a - 0.3))) * s; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return P; };

// a mitten hand at (x, y), rotated a
function mitt(x, y, r, a, skin, key) {
  cut(ellipsePts(x, y, r, r * 0.82, a, 18), skin, { key: key + 'h', sb: 4, sy: 3 });
  cut(ellipsePts(x + Math.cos(a - 1.2) * r * 0.75, y + Math.sin(a - 1.2) * r * 0.75, r * 0.42, r * 0.26, a - 1.2, 12), skin, { key: key + 't', sb: 3, sy: 2 });
}
// an arm from the shoulder (x, y) at angle a (0 = straight down, + = towards +x), length L; returns the hand point
function arm(x, y, a, L, w, sleeve, skin, key, o = {}) {
  const hx = x + Math.sin(a) * L, hy = y + Math.cos(a) * L;
  const sl = o.sleeve ?? 0.7, sx = x + Math.sin(a) * L * sl, sy = y + Math.cos(a) * L * sl;
  cut(capsulePts(x, y, hx, hy, w * 0.8), skin, { key: key + 'sk', sb: 4, sy: 3, tear: 0.6 });
  cut(capsulePts(x, y, sx, sy, w), sleeve, { key: key + 'sl', sb: 5, sy: 4, tear: 0.8 });
  mitt(hx, hy, w * 0.55, Math.PI / 2 - a, skin, key + 'm');
  return [hx, hy];
}

// ---- a full-body person, feet at (x, y). o: kind 'girl' | 'woman' | 'man', s, mood, top, bottom, aoDai, skin, armL, armR
//      girl: pigtails with teal clips (the hero) unless o.bob (another child); woman: o.bun or o.clip (the grown hero)
//      returns { handL, handR, head } in world coords
function figure(x, y, o = {}) {
  const s = o.s ?? 1, key = o.key ?? 'fig', kind = o.kind ?? 'woman', skin = o.skin ?? PAL.skin1;
  const child = kind === 'girl' || kind === 'boy';
  const bob = Math.sin(TT * TAU * 0.7 + key.length) * 3 * s;
  const legH = (child ? 150 : 250) * s, bodyH = (child ? 190 : 300) * s, headR = (child ? 72 : 66) * s, bw = (child ? 120 : 140) * s;
  const hipY = y - legH, shY = hipY - bodyH + bob, headY = shY - headR * 1.05;
  const top = o.top ?? C2.shirt, bottom = o.bottom ?? C2.navyS;
  // legs + shoes
  for (const sg of [-1, 1]) {
    const lx = x + sg * bw * 0.22;
    cut(capsulePts(lx, hipY, lx + sg * 4 * s, y - 12 * s, 30 * s), o.aoDai ? '#f2efe6' : (kind === 'girl' && !o.pants ? skin : bottom), { key: key + 'lg' + sg, sb: 4, tear: 0.6 });
    cut(ellipsePts(lx + sg * 10 * s, y - 6 * s, 30 * s, 15 * s, 0, 14), o.shoe ?? '#3a2a24', { key: key + 'sh' + sg, sb: 3, sy: 2 });
  }
  const armA = (o.armL ?? 0.12), armB = (o.armR ?? 0.12);   // both: positive = outward, ~1.6 = horizontal, ~2.8 = straight up
  const handL = arm(x - bw * 0.42, shY + 20 * s, -armA, (child ? 170 : 250) * s, (child ? 40 : 46) * s, top, skin, key + 'aL', { sleeve: o.short ? 0.35 : 0.85 });
  // body
  if (o.aoDai) {
    cut([[x - bw * 0.5, shY], [x + bw * 0.5, shY], [x + bw * 0.58, hipY + 10 * s], [x + bw * 0.62, y - 70 * s], [x + bw * 0.1, y - 70 * s], [x, hipY + 40 * s], [x - bw * 0.1, y - 70 * s], [x - bw * 0.62, y - 70 * s], [x - bw * 0.58, hipY + 10 * s]], top, { key: key + 'ao', pat: o.pat, sb: 10 });
  } else {
    if (kind === 'girl' && !o.pants) cut([[x - bw * 0.48, hipY - 30 * s], [x + bw * 0.48, hipY - 30 * s], [x + bw * 0.75, hipY + 70 * s], [x - bw * 0.75, hipY + 70 * s]], bottom, { key: key + 'sk', pat: pat.stripes('rgba(255,255,255,0.12)', 6, 30, 0.2) });
    else cut(rect(x - bw * 0.5, hipY - 40 * s, bw, 60 * s, 8 * s), bottom, { key: key + 'pt' });
    cut(rrectPts(x - bw * 0.5, shY, bw, bodyH - 20 * s, 30 * s), top, { key: key + 'tp', pat: o.pat });
    if (o.scarf) cut([[x - 26 * s, shY + 8 * s], [x + 26 * s, shY + 8 * s], [x + 6 * s, shY + 90 * s], [x - 16 * s, shY + 84 * s]], C2.red, { key: key + 'sc', sb: 4 });
    if (o.tie) cut([[x - 10 * s, shY + 10 * s], [x + 10 * s, shY + 10 * s], [x + 14 * s, shY + 120 * s], [x, shY + 140 * s], [x - 14 * s, shY + 120 * s]], o.tie, { key: key + 'ti', sb: 4 });
  }
  if (o.bag) cut(rrectPts(x + bw * 0.38, shY + 20 * s, 60 * s, 130 * s, 16 * s), o.bag, { key: key + 'bg', pat: pat.dots('rgba(255,255,255,0.35)', 4 * s, 22 * s) });
  // neck, head, hair
  cut(rect(x - 16 * s, shY - 34 * s, 32 * s, 40 * s, 8 * s), skin, { key: key + 'nk', shadow: false });
  if (kind === 'girl' && !o.bob) for (const sg of [-1, 1]) {   // pigtails with teal clips: the hero's cue
    cut(ellipsePts(x + sg * headR * 1.05, headY + headR * 0.35, 26 * s, 50 * s, sg * 0.3, 18), C2.hair, { key: key + 'pg' + sg, sb: 5 });
    cut(rrectPts(x + sg * headR * 0.92 - 15 * s, headY - 6 * s, 30 * s, 22 * s, 6 * s), C2.clip, { key: key + 'cl' + sg, sb: 3, sy: 2 });
  }
  if (kind === 'woman' && !o.bun) for (const sg of [-1, 1]) cut(capsulePts(x + sg * headR * 0.86, headY - headR * 0.3, x + sg * headR * 1.0, headY + headR * 1.5, headR * 0.5), o.hair ?? C2.hair, { key: key + 'lh' + sg, sb: 6 });
  cut(ellipsePts(x, headY, headR, headR * 1.05, 0, 30), skin, { key: key + 'hd' });
  const hc = o.hair ?? C2.hair;
  if (kind === 'man') cut([[x - headR, headY - 10 * s], [x - headR * 0.9, headY - headR * 0.8], [x, headY - headR * 1.15], [x + headR * 0.9, headY - headR * 0.8], [x + headR, headY - 10 * s], [x + headR * 0.6, headY - headR * 0.55], [x - headR * 0.6, headY - headR * 0.5]], hc, { key: key + 'hr', sb: 4 });
  else cut([[x - headR * 1.02, headY + 6 * s], [x - headR * 0.95, headY - headR * 0.75], [x, headY - headR * 1.12], [x + headR * 0.95, headY - headR * 0.75], [x + headR * 1.02, headY + 6 * s], [x + headR * 0.5, headY - headR * 0.45], [x - headR * 0.2, headY - headR * 0.55]], hc, { key: key + 'hr', sb: 4 });
  if (kind === 'woman' && o.bun) cut(ellipsePts(x + headR * 0.2, headY - headR * 1.05, 34 * s, 30 * s, 0, 16), hc, { key: key + 'bn', sb: 4 });
  if (o.clip) cut(rrectPts(x + headR * 0.45, headY - headR * 0.7, 34 * s, 20 * s, 6 * s), C2.clip, { key: key + 'clw', sb: 3, sy: 2 });
  if (o.bob && o.bow) cut(ellipsePts(x + headR * 0.6, headY - headR * 0.75, 26 * s, 16 * s, 0.4, 14), o.bow, { key: key + 'bw', sb: 3 });
  let mood = o.mood ?? 'smile';
  if (mood !== 'happy' && mood !== 'focus' && (B + key.length * 7) % 41 < 2) mood = 'focus';   // a blink
  faceV(x, headY + 6 * s, s * (child ? 1.15 : 1.0), mood);
  if (o.glasses) { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(x - 17 * s, headY + 6 * s, 15 * s, 0, TAU); ctx.moveTo(x + 32 * s, headY + 6 * s); ctx.arc(x + 17 * s, headY + 6 * s, 15 * s, 0, TAU); ctx.stroke(); }
  if (o.tears) for (const sg of [-1, 1]) { const k = mod(TT * 1.6 + (sg > 0 ? 0.5 : 0), 1); cut(ellipsePts(x + sg * 22 * s, headY + 26 * s + k * 50 * s, 6 * s, 9 * s, 0, 10), '#8fd0f0', { key: key + 'tr' + sg, shadow: false, grain: false }); }
  const handR = arm(x + bw * 0.42, shY + 20 * s, armB, (child ? 170 : 250) * s, (child ? 40 : 46) * s, top, skin, key + 'aR', { sleeve: o.short ? 0.35 : 0.85 });
  return { handL, handR, head: [x, headY] };
}

// ---- props
function vnFlag(x, y, w, key = 'flag') {   // on a pole at x; waving
  ink([[x, y], [x, y + w * 2.6]], { w: 8, color: '#8a7f78', key: key + 'pole' });
  const h = w * 0.66, P = [];
  for (let i = 0; i <= 12; i++) P.push([x + w * i / 12, y + Math.sin(i * 0.6 - TT * 6) * 8 * (i / 12)]);
  for (let i = 12; i >= 0; i--) P.push([x + w * i / 12, y + h + Math.sin(i * 0.6 - TT * 6) * 8 * (i / 12)]);
  cut(P, C2.red, { key: key + 'f', tear: 0.5, sb: 6 });
  const cx = x + w / 2, cy = y + h / 2 + Math.sin(6 * 0.6 - TT * 6) * 4, sp = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 0.4 : 1) * h * 0.32; sp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  cut(sp, C2.starY, { key: key + 'st', shadow: false, tear: 0.3, amt: 0.3 });
}
function bunting(x0, x1, y, sag, key = 'bt') {
  const cols = [PAL.teal, PAL.yellow, PAL.pink, PAL.blue, PAL.green, PAL.purple], n = Math.round((x1 - x0) / 70);
  const yAt = (u) => y + Math.sin(u * Math.PI) * sag;
  ink(Array.from({ length: 21 }, (_, i) => [lerp(x0, x1, i / 20), yAt(i / 20)]), { w: 3, color: '#6b5a50', key: key + 'str' });
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, px = lerp(x0, x1, u), py = yAt(u), sw = Math.sin(TT * 3 + i) * 4; cut([[px - 24, py], [px + 24, py], [px + sw, py + 50]], cols[i % cols.length], { key: key + i, sb: 4, sy: 3 }); }
}
function birds(x, y, n, key = 'bd') {   // birds on a wire
  ink([[x - 40, y + 30], [x + n * 70 + 40, y + 36]], { w: 3, color: '#5a5048', key: key + 'w' });
  for (let i = 0; i < n; i++) { const hop = ((B + i * 13) % 29 < 2) ? -10 : 0, bx = x + i * 70, by = y + 4 + hop; cut(ellipsePts(bx, by, 26, 20, 0, 16), PAL.navy, { key: key + i, sb: 3 }); cut(ellipsePts(bx + 14, by - 14, 13, 12, 0, 12), PAL.navy, { key: key + 'h' + i, sb: 2 }); dot(bx + 18, by - 16, 2.5, '#fff'); cut([[bx + 26, by - 14], [bx + 36, by - 10], [bx + 26, by - 8]], PAL.mustard, { key: key + 'bk' + i, shadow: false }); }
}
function school(x, y, w, h, key = 'sch', sign = 'TRƯỜNG TIỂU HỌC') {   // (x, y) = bottom-left
  cut(rect(x, y - h, w, h, 4), '#f2d27a', { key: key + 'w', pat: pat.lines('rgba(160,110,40,0.10)', 26) });
  cut([[x - 40, y - h + 10], [x + w / 2, y - h - 150], [x + w + 40, y - h + 10]], '#b8513f', { key: key + 'r', pat: pat.stripes('rgba(80,20,10,0.18)', 5, 26, 0.6) });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) cut(rect(x + 40 + c * (w - 80) / 4 + 10, y - h + 60 + r * (h / 2 - 20), (w - 80) / 4 - 20, h / 2 - 90, 4), '#7fb6c9', { key: key + 'win' + r + c, pat: pat.lines('rgba(255,255,255,0.25)', 22) });
  tag(sign, x + w / 2, y - h - 30, 40, { tape: false, fill: PAL.paper, rot: 0 });
}
function tree(x, y, s, key = 'tr', c = PAL.green) {
  cut(capsulePts(x, y, x, y - 300 * s, 46 * s), PAL.woodD, { key: key + 'tk', pat: pat.grainWood('rgba(60,30,10,0.2)') });
  [[0, -380, 150], [-110, -300, 110], [110, -310, 115], [0, -250, 120]].forEach(([dx, dy, r], i) => cut(ellipsePts(x + dx * s, y + dy * s, r * s, r * 0.9 * s, 0, 24), i % 2 ? c : PAL.greenD, { key: key + 'c' + i, crayon: 'rgba(30,80,30,0.5)', crAl: 0.3 }));
}
function desk(x, y, w, key = 'dk') {   // top surface at y
  cut(rect(x, y, w, 30, 4), PAL.wood, { key: key + 't', pat: pat.grainWood('rgba(120,60,20,0.2)') });
  cut(rect(x + 20, y + 30, 22, 160, 4), PAL.woodD, { key: key + 'l1' });
  cut(rect(x + w - 42, y + 30, 22, 160, 4), PAL.woodD, { key: key + 'l2' });
}
function blackboard(x, y, w, h, key = 'bb') {
  cut(rect(x - 16, y - 16, w + 32, h + 32, 6), PAL.woodD, { key: key + 'f' });
  cut(rect(x, y, w, h, 3), C2.board, { key: key + 'b', shadow: false, pat: (bb) => { pencil(bb, { key: key + 'smudge', c: 'rgba(255,255,255,0.08)', al: 1, per: 220, len: 60, w: 6, a: 0.2, max: 400 }); } });
  cut(rect(x + 30, y + h + 6, w - 60, 16, 3), PAL.wood, { key: key + 'tray' });
}
function chalkText(str, x, y, size, frac = 1, key = 'ch') { handText(str, x, y, size, C2.chalk, { key, frac }); }
function paperTest(x, y, s, mark, key = 'pt', o = {}) {   // a test paper with a big red mark
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.08); ctx.scale(s, s);
  cut(rect(-90, -120, 180, 240, 3), PAL.paper, { key: key + 'p', pat: pat.lines('rgba(80,110,180,0.25)', 26, 40) });
  handText('Bài kiểm tra', -70, -80, 30, PAL.ink, { key: key + 't' });
  handText(mark, -10, 40, 120, C2.red, { key: key + 'm' });
  ctx.strokeStyle = C2.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(18, 0, 62, 70, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
function umbrella(x, y, r, c, key = 'um', hl = 1.5) {   // canopy centre at (x, y); handle hl*r below
  ink([[x, y], [x, y + r * hl], [x + 18, y + r * (hl + 0.12)]], { w: 8, color: PAL.woodD, key: key + 'h' });
  const P = []; for (let i = 0; i <= 40; i++) { const a = Math.PI + i / 40 * Math.PI; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.75]); }
  for (let i = 6; i >= 0; i--) { const u = i / 6; P.push([x - r + u * 2 * r, y + 14 * Math.abs(Math.sin(u * Math.PI * 3))]); }
  cut(P, c, { key: key + 'c', crayon: PAL.mustard, crAl: 0.35, pat: pat.stripes('rgba(255,255,255,0.2)', 10, 70, 0.0) });
}
const umbrellaPts = (x, y, r) => { const P = []; for (let i = 0; i <= 60; i++) { const a = Math.PI + i / 60 * Math.PI; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.75]); } P.push([x + r, y + 12], [x - r, y + 12]); return P; };
const capPts = (x, y, r) => [[x - r, y], [x, y - r * 0.42], [x + r, y], [x, y + r * 0.42]];
function rainFall(key = 'rain', n = 120) {
  const R = RNG(key);
  for (let i = 0; i < n; i++) { const x0 = R.r(-40, W + 40), sp = R.r(900, 1300), y = mod(R.r(0, H) + TT * sp, H + 200) - 100; ink([[x0 - y * 0.08, y], [x0 - y * 0.08 - 8, y + 46]], { w: 3, color: 'rgba(220,235,255,0.7)', amt: 0.2, key: key + i }); }
}
function confetti(t0, key = 'cf', n = 70) {
  if (TT < t0) return;
  const R = RNG(key), cols = [PAL.yellow, PAL.teal, PAL.pink, PAL.blue, PAL.green, PAL.purple];
  for (let i = 0; i < n; i++) { const x = R.r(40, W - 40) + Math.sin(TT * 2 + i) * 30, y = -60 + (TT - t0) * R.r(220, 420) + R.r(-400, 0); if (y < -40 || y > H) continue; cut(rot(rect(x, y, 22, 12, 2), x, y, TT * R.r(2, 6) + i), cols[i % cols.length], { key: key + i, shadow: false, grain: false, tear: 0.3 }); }
}
function dustMotes(bb, key = 'dm', n = 40) {
  const R = RNG(key);
  for (let i = 0; i < n; i++) { const x = R.r(bb[0], bb[2]) + Math.sin(TT * 0.7 + i) * 20, y = R.r(bb[1], bb[3]) + Math.cos(TT * 0.5 + i * 2) * 20; dot(x, y, R.r(2, 4), 'rgba(255,248,220,0.7)'); }
}

function faceV(x, y, s, mood) {
  if (mood !== 'sad') return face(x, y, s, mood);
  const I = PAL.ink;
  for (const sg of [-1, 1]) { dot(x + sg * 16 * s, y + 2 * s, 6 * s, I); dot(x + sg * 16 * s + 2 * s, y - 0.4 * s, 2 * s, '#fff'); ink([[x + sg * 26 * s, y - 10 * s], [x + sg * 8 * s, y - 17 * s]], { w: 3 * s, color: I, amt: 0.2, key: 'fv' + sg }); }
  ctx.fillStyle = 'rgba(240,110,120,0.45)'; ctx.beginPath(); ctx.ellipse(x - 27 * s, y + 13 * s, 7 * s, 4.5 * s, 0, 0, TAU); ctx.ellipse(x + 27 * s, y + 13 * s, 7 * s, 4.5 * s, 0, 0, TAU); ctx.fill();
  ink(arcPts(x, y + 26 * s, 7 * s, Math.PI * 1.15, Math.PI * 1.85, 8), { w: 3.2 * s, color: I, amt: 0.2, key: 'fvm' });
}
