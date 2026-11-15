// ---- 4–5. Lớp 9: a bad mark in the rain; the teacher's yellow umbrella; "không sao, mình làm lại"
function sRain() {
  const um = ev(CU.umbrella, 0.7), redo = ev(CU.redo, 0.4);
  const sky = um > 0 ? '#9fb3c4' : '#7d8ea0';
  cut(rect(-330, -330, W + 660, H + 660, 0), sky, { key: 'rSky', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.07)', 30, 90, 0.2) });
  [[200, 330], [620, 300], [930, 380]].forEach(([x, y], i) => cut(ellipsePts(x + Math.sin(TT * 0.5 + i) * 14, y, 150, 60, 0, 22), '#6c7a88', { key: 'rcl' + i, sb: 6 }));
  school(500, 1020, 400, 300, 'rSch', 'TRƯỜNG THCS');
  tree(250, 1180, 1.25, 'rTree', '#4d8a52');
  cut([[-340, 1100], [1420, 1100], [1420, 2300], [-340, 2300]], '#8a9a8a', { key: 'rYard', sy: -4, pat: pat.gingham('rgba(255,255,255,0.08)', 40) });
  // puddles with rings
  [[760, 1500, 150], [180, 1560, 110]].forEach(([x, y, r], i) => { cut(ellipsePts(x, y, r, r * 0.25, 0, 24), '#aac3d6', { key: 'rPud' + i, shadow: false }); const k = mod(TT * 1.3 + i * 0.4, 1); ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x + 20, y, 20 + k * r * 0.7, (20 + k * r * 0.7) * 0.25, 0, 0, TAU); ctx.stroke(); });
  // the bench
  cut(rect(220, 1300, 520, 34, 6), PAL.wood, { key: 'rBench', pat: pat.grainWood('rgba(120,60,20,0.2)') });
  cut(rect(250, 1334, 26, 120, 4), PAL.woodD, { key: 'rBl1' }); cut(rect(684, 1334, 26, 120, 4), PAL.woodD, { key: 'rBl2' });
  // she sits, crying, holding the test; then the teacher's umbrella; the 3 crumples, a fresh 9
  const kid = figure(470, 1470, { kind: 'girl', key: 'rK', s: 1.08, top: C2.shirt, bottom: C2.navyS, pants: true, bag: PAL.purple, armL: 0.5, armR: 0.7, mood: redo > 0.5 ? 'happy' : 'sad', tears: redo < 0.5 });
  const pt = kid.handR;
  if (redo < 1) paperTest(pt[0] + 40, pt[1] - 90, 1 - redo * 0.8, '3', 'rT3', { rot: -0.15 + redo * 2 });
  if (redo > 0) paperTest(pt[0] + 40, pt[1] - 90, popS(CU.redo + 0.2), '9', 'rT9', { rot: 0.06 });
  let canopy = null;
  if (um > 0) {
    const tx = lerp(1250, 740, EZ.o2(um));
    const t = figure(tx, 1460, { kind: 'man', key: 'rT', s: 1.0, top: '#e9e3d4', bottom: '#4a4550', tie: PAL.blue, glasses: true, armL: 2.35, armR: 0.15, mood: 'smile' });
    canopy = [t.handL[0] - 18, t.handL[1] - 290 * 0.8, 290];
    umbrella(...canopy, PAL.yellow, 'rUm', 0.8);
  }
  if (!canopy) rainFall('rain', 140);
  else { const [cx, cy, r] = canopy; ctx.save(); ctx.beginPath(); ctx.rect(-40, -40, W + 80, H + 80); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.lineTo(cx + r + 40, H); ctx.lineTo(cx - r - 40, H); ctx.closePath(); ctx.clip('evenodd'); rainFall('rain', 140); ctx.restore(); }
  yearTag('Lớp 9');
  capStrip(redo > 0 ? 'không sao, mình làm lại' : 'điểm kém');
}

// ---- 6. Eighteen: graduation, the bus, the city — the world runs past while she holds her spot (the anchor)
const GROW_SPOT = [520, 1100];
function sGrow() {
  const e0 = ERA_LIST[4][0], e1 = ERA_LIST[4][1], k = Math.floor(Math.max(0, TT - e0 - 0.6) / E8);   // a new world every 8th after the cap lands
  const worlds = [
    () => { cut(rect(-330, -330, W + 660, H + 660, 0), PAL.purple, { key: 'grHall', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.12)', 30, 90) }); bunting(60, 1020, 380, 40, 'grBunt'); tag('Tốt nghiệp', 540, 560, 70, { rot: -0.02 }); confetti(e0, 'grCf', 50); },
    () => { cut(rect(-330, -330, W + 660, H + 660, 0), '#3a4a7a', { key: 'grBus', shadow: false, tear: 0, shade: false }); for (let i = 0; i < 3; i++) { const x = 60 + i * 330; cut(rect(x, 420, 290, 420, 14), '#9fd0a0', { key: 'grWin' + i, pat: (bb) => { const off = mod(TT * 900, 300); for (let j = -1; j < 3; j++) cut(ellipsePts(bb.x0 + j * 150 + 150 - off, 700, 80, 120, 0, 16), PAL.greenD, { key: 'grTr' + i + j, sb: 3 }); } }); } },
    () => { cut(rect(-330, -330, W + 660, H + 660, 0), '#26315f', { key: 'grCity', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.12)', 3, 60) }); const off = mod(TT * 600, 1300); for (let i = 0; i < 8; i++) { const x = i * 190 - off + 200, h = 300 + (i * 97) % 380; cut(rect(x, 1000 - h, 160, h + 400, 4), ['#4c5a8c', '#5d4c8c', '#3d6a7a'][i % 3], { key: 'grB' + i, pat: pat.dots('rgba(255,220,120,0.5)', 6, 34) }); } },
    () => { cut(rect(-330, -330, W + 660, H + 660, 0), '#f3b77a', { key: 'grSun', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.14)', 40, 110) }); cut(ellipsePts(800, 520, 150, 150, 0, 36), PAL.yellow, { key: 'grSunD', crayon: PAL.mustard }); for (let i = 0; i < 4; i++) cut(ellipsePts(mod(200 + i * 330 - TT * 500, 1400) - 100, 760 + i * 30, 120, 40, 0, 18), '#fff4e2', { key: 'grCl' + i, sb: 6 }); },
  ];
  worlds[TT > e1 - 1.1 ? 1 : k % worlds.length]();   // the bus world holds into the window bridge
  cut([[-340, 1180], [1420, 1180], [1420, 2300], [-340, 2300]], '#c9b79a', { key: 'grFloor', sy: -4, pat: pat.lines('rgba(90,60,30,0.12)', 30) });
  // she holds her spot; the cap lands on her head first
  const g = figure(GROW_SPOT[0], 1500, { kind: 'woman', key: 'grH', s: 1.0, top: C2.aoWhite, aoDai: true, clip: true, bag: PAL.teal, armL: 0.2, armR: 2.2 + 0.4 * Math.sin(TT * 4), mood: 'happy' });
  const cy = g.head[1] - 70, land = EZ.o2(seg(TT, e0, e0 + 0.6));
  cut(capPts(g.head[0], lerp(cy - 600, cy, land), 120), PAL.ink, { key: 'grCap', sb: 6 });
  ink([[g.head[0] + 10, cy], [g.head[0] + 70, cy + 70]], { w: 4, color: PAL.yellow, key: 'grTassel' });
  yearTag('18 tuổi');
  capStrip('đi thật xa');
}

// ---- 7. Twenty years later: the old classroom, empty; the door opens; silence
function classroom(key, full) {
  cut(rect(-330, -330, W + 660, H + 660, 0), '#efe2c2', { key: key + 'Wall', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(160,120,60,0.08)', 3, 40) });
  blackboard(150, 430, 780, 440, key + 'BB');
  cut(rect(-330, 1180, W + 660, 1100, 0), PAL.wood, { key: key + 'Floor', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.16)'), sy: -6 });
  // the window with a light beam (the next bridge counterpart sits here)
  cut(rect(960, 380, 160, 420, 4), '#a9d4e8', { key: key + 'Win', pat: pat.lines('rgba(255,255,255,0.35)', 50) });
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.moveTo(960, 400); ctx.lineTo(960, 800); ctx.lineTo(420, 1500); ctx.lineTo(120, 1500); ctx.closePath(); ctx.fill(); ctx.restore();
  clock(120, 330, 56, 7, 30, key + 'Clock');
  // rows of desks (backs of children's heads when full)
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const x = 100 + c * 300 + r * 40, y = 1400 + r * 170;
    if (full) { const hx = x + 120, hy = y - 40 + Math.sin(TT * 3 + r * 3 + c) * 4; cut(ellipsePts(hx, hy, 58, 62, 0, 20), C2.hair, { key: key + 'kh' + r + c, sb: 6 }); cut(rect(hx - 70, hy + 40, 140, 70, 30), C2.shirt, { key: key + 'kb' + r + c }); }
    desk(x, y, 250, key + 'D' + r + c);
  }
}
function sReturn() {
  classroom('re', false);
  dustMotes([140, 420, 960, 1400], 'reDust', 46);
  // the door opens; her silhouette in the doorway
  const op = ev(CU.door, 1.2);
  cut(rect(-40, 760, 150, 460, 4), '#3a2a24', { key: 'reDoorway', shadow: false });
  cut(rect(-40, 760, 150 * (1 - op * 0.75), 460, 4), PAL.woodD, { key: 'reDoor', pat: pat.grainWood('rgba(60,30,10,0.2)') });
  if (op > 0.3) figure(60, 1220, { kind: 'woman', key: 'reH', s: 0.62, top: C2.aoTeal, aoDai: true, clip: true, armL: 0.1, armR: -0.1, mood: 'smile' });
  yearTag('20 năm sau');
  capStrip('lớp học cũ');
}

// ---- 8. The hard cut, the payoff: she is the teacher, chalk in hand; "a" on the board again
function sBoard() {
  classroom('bo', true);
  const w = ev(CU.payoff ?? ERA_LIST[6][0] - 0.2, 0.8);
  chalkText('a', 240, 700, 220, 1, 'boA');
  chalkText('ă  â', 470, 700, 160, w, 'boA2');
  chalkText('20 / 11', 520, 840, 70, 1, 'boDate');
  const her = figure(800, 1330, { kind: 'woman', key: 'boH', s: 0.95, top: C2.aoTeal, aoDai: true, clip: true, armL: 2.5 + Math.sin(TT * 5) * 0.08, armR: 0.2, mood: 'happy' });
  cut(capsulePts(her.handL[0] - 10, her.handL[1] - 10, her.handL[0] - 40, her.handL[1] - 40, 16), C2.chalk, { key: 'boChalk', sb: 3 });
  // a jar of orange flowers on her desk
  cut(rect(660, 1110, 80, 90, 12), 'rgba(200,230,240,0.85)', { key: 'boJar' });
  flower(690, 1050, 0.55, 'boF1', { rot: -0.2 }); flower(720, 1040, 0.5, 'boF2', { rot: 0.25 });
  yearTag('20 năm sau');
  capStrip('lần này, em là cô giáo');
}

// ---- 9. The title: a bouquet of orange paper flowers; Tri ân thầy cô · 20.11
function sThanks() {
  cut(rect(-330, -330, W + 660, H + 660, 0), PAL.pinkL, { key: 'tWall', shadow: false, tear: 0, shade: false, pat: pat.gingham('rgba(255,255,255,0.22)', 30) });
  // photos of her teachers pinned on the wall (callbacks)
  [[200, 520, -0.08, C2.aoMint, 'woman'], [480, 470, 0.05, '#e9e3d4', 'man'], [760, 530, -0.04, C2.aoTeal, 'woman']].forEach(([x, y, a, top, kind], i) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    cut(rect(-110, -130, 220, 260, 4), PAL.paper, { key: 'tPh' + i });
    cut(rect(-90, -110, 180, 180, 2), PAL.sky, { key: 'tPhB' + i, shadow: false });
    ctx.save(); ctx.beginPath(); ctx.rect(-90, -110, 180, 180); ctx.clip(); figure(0, 260, { kind, key: 'tPf' + i, s: 0.45, top, aoDai: kind === 'woman', bun: i === 0, clip: i === 2, glasses: kind === 'man', tie: kind === 'man' ? PAL.blue : null, mood: 'happy' }); ctx.restore();
    cut(ellipsePts(0, -130, 12, 12, 0, 12), C2.red, { key: 'tPin' + i, sb: 3 });
    ctx.restore();
  });
  // the bouquet: one flower per era, gathered
  const R = RNG('bq'); const fl = [[540, 1000], [440, 1060], [640, 1060], [500, 1140], [600, 1150], [400, 1170], [690, 1180]];
  for (let i = fl.length - 1; i >= 0; i--) flower(fl[i][0], fl[i][1], 0.95 * popS(ERA_LIST[8][0] + 0.15 + i * 0.12), 'tF' + i, { rot: R.n(0.4) });
  cut([[430, 1240], [650, 1240], [600, 1460], [480, 1460]], PAL.teal, { key: 'tWrap', pat: pat.dots('rgba(255,255,255,0.35)', 5, 26) });
  cut(ellipsePts(540, 1260, 50, 20, 0, 14), C2.red, { key: 'tBow', sb: 4 });
  const t1 = ev(CU.thanks, 0.9), t2 = ev(ERA_LIST[8][0] + 0.5, 1.0);
  ctx.save(); ctx.translate(540, 820); ctx.rotate(-0.03);
  cut(rect(-380, -110, 760, 200, 6), PAL.paper, { key: 'tCard', tear: 1.8 });
  handText('Tri ân thầy cô', -320, 40, 118, C2.redD, { key: 'tTitle', frac: t2 });
  ctx.restore();
  tag('20.11', 830, 330, 96, { rot: 0.05, s: popS(CU.title) });
  if (t1 > 0) tag('Ngày Nhà giáo Việt Nam · từ 1982', CX, 1400, 46, { tape: false, rot: 0.01, frac: t1 });
  confetti(CU.thanks, 'tCf', 60);
}
