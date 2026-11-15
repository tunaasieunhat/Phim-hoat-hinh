// =====================================================================
//  SCENES — one per era, world coords 1080x1920; content inside x 60–940, y 250–1500.
// =====================================================================
const CU = TIMELINE.cues;

// ---- 1 / 8. The school gate. end = twenty years later: she is the teacher; a small girl brings her the flower
function sGate(o = {}) {
  const end = !!o.end;
  cut(rect(-330, -330, W + 660, H + 660, 0), '#bfe0ee', { key: 'gSky', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.16)', 40, 120, 0.15) });
  [[160, 330], [700, 270], [980, 420]].forEach(([x, y], i) => cut(ellipsePts(x + Math.sin(TT * 0.6 + i) * 18, y, 90, 34, 0, 20), '#ffffff', { key: 'gcl' + i, sb: 6 }));
  birds(560, 470, 3, 'gBirds');
  school(130, 1060, 820, 420, 'gSch');
  vnFlag(120, 560, 150, 'gFlag');
  bunting(80, 1000, 690, 50, 'gBunt');
  // the yard and the gate pillars
  cut([[-340, 1040], [1420, 1040], [1420, 2300], [-340, 2300]], '#d9c9a8', { key: 'gYard', sy: -4, pat: pat.gingham('rgba(255,255,255,0.10)', 40) });
  cut(rect(30, 820, 90, 460, 6), '#e6dccb', { key: 'gPilL', pat: pat.stripes('rgba(120,100,80,0.12)', 4, 30, Math.PI / 2) });
  cut(rect(960, 820, 90, 460, 6), '#e6dccb', { key: 'gPilR', pat: pat.stripes('rgba(120,100,80,0.12)', 4, 30, Math.PI / 2) });
  // the school drum, a cat on the step
  cut(ellipsePts(860, 1160, 62, 48, 0, 24), C2.red, { key: 'gDrum', pat: pat.stripes('rgba(255,220,120,0.5)', 6, 40, Math.PI / 2) });
  cut(rect(830, 1200, 60, 70, 4), PAL.woodD, { key: 'gDrumL' });
  cat(170, 1340, 0.75, PAL.charcoal, 'gCat');
  if (!end) {
    // Lớp 1: the hero (small, nervous) holds her mother's hand; the teacher waits at the door
    const tch = figure(830, 1330, { kind: 'woman', key: 'gT', s: 0.82, top: C2.aoMint, aoDai: true, bun: true, armR: 2.3 + Math.sin(TT * 5) * 0.25, mood: 'smile' });
    const give = popS(CU.give);
    const mom = figure(330, 1460, { kind: 'woman', key: 'gM', s: 0.95, top: PAL.blue, bottom: '#3b3550', pants: true, pat: pat.gingham('rgba(255,255,255,0.18)', 10), armR: 0.09, mood: 'smile' });
    const kid = figure(600, 1430, { kind: 'girl', key: 'gK', s: 0.92, top: C2.shirt, bottom: C2.navyS, bag: PAL.pink, armL: 1.2, armR: lerp(0.3, 1.9, give), mood: TT < CU.give ? 'sad' : 'wow' });
    flower(kid.handR[0] + 6, kid.handR[1] - 40, 0.9, 'gFlower');
    yearTag('Lớp 1');
    capStrip('ngày đầu đi học');
  } else {
    // twenty years later: she (one teal clip, áo dài) at the door; a small girl with a red bow brings her the flower
    const offer = ev(CU.offer, 0.6);
    const her = figure(800, 1400, { kind: 'woman', key: 'gH', s: 0.9, top: C2.aoTeal, aoDai: true, clip: true, armR: 0.15, armL: lerp(0.2, 1.0, offer), mood: offer > 0.5 ? 'happy' : 'smile' });
    const mom = figure(165, 1480, { kind: 'woman', key: 'gM2', s: 0.92, top: PAL.purple, bottom: '#3b3550', pants: true, pat: pat.dots('rgba(255,255,255,0.25)', 5, 26), armR: 0.3, mood: 'smile' });
    const kid = figure(470, 1440, { kind: 'girl', key: 'gK2', bob: true, bow: C2.red, s: 0.88, top: C2.shirt, bottom: PAL.teal, bag: PAL.yellow, armL: 1.2, armR: lerp(0.3, 1.3, offer), mood: offer > 0.4 ? 'happy' : 'sad' });
    flower(kid.handR[0] + 6, kid.handR[1] - 40, 0.9, 'gFlower2');
    yearTag('20 năm sau');
    capStrip('không dám buông');
  }
}

// ---- 2. Extreme close-up: the teacher's hand over hers, the first letters on squared paper
function sWrite() {
  cut(rect(-330, -330, W + 660, H + 660, 0), PAL.wood, { key: 'wDesk', shadow: false, tear: 0, shade: false, pat: pat.grainWood('rgba(120,60,20,0.2)') });
  // the notebook: ô ly paper
  cut(rot(rect(90, 420, 900, 1020, 6), 540, 930, -0.04), '#fbfaf4', { key: 'wPage', sb: 16, pat: (bb) => { pat.lines('rgba(120,110,200,0.28)', 22)(bb); pat.stripes('rgba(120,110,200,0.22)', 2, 22)(bb); pat.stripes('rgba(220,80,90,0.4)', 3, 2000)(bb); } });
  // the letters: a, ă, then the o (the bridge object), written on as she speaks
  const w1 = ev(CU.write, 0.9), w2 = ev(CU.write + 0.9, 0.7), w3 = ev(CU.write + 1.6, 0.6);
  handText('a', 200, 760, 190, PAL.navy, { key: 'wA', frac: w1 });
  handText('ă', 380, 760, 190, PAL.navy, { key: 'wA2', frac: w2 });
  handText('o', 580, 760, 190, PAL.navy, { key: 'wO', frac: w3 });
  // the ruler, eraser crumbs, the orange flower resting by the page
  cut(rot(rect(120, 1300, 700, 70, 4), 470, 1335, 0.05), PAL.yellow, { key: 'wRuler', pat: pat.stripes('rgba(80,60,20,0.5)', 3, 36) });
  const R = RNG('crumbs'); for (let i = 0; i < 9; i++) cut(ellipsePts(780 + R.r(-50, 80), 1250 + R.r(-40, 60), 9, 6, R.r(0, 3), 8), PAL.pinkL, { key: 'wCr' + i, sb: 2, sy: 1 });
  flower(860, 470, 0.85, 'wFlower', { rot: 0.9 });
  // the two hands: hers holds the pencil, the teacher's (mint sleeve) wraps over it, moving with the stroke
  const px = 250 + w1 * 110 + w2 * 130 + w3 * 120, py = 820 + Math.sin(TT * 9) * 10;
  drawPencil(px, py, -2.2, 260, 1.2, 'wPencil');
  cut(capsulePts(px + 160, py + 260, px + 560, py + 640, 150), C2.shirt, { key: 'wSleeveK' });
  cut(ellipsePts(px + 90, py + 150, 110, 90, 0.7, 22), PAL.skin1, { key: 'wHandK' });
  cut(capsulePts(px + 240, py + 120, px + 700, py + 380, 170), C2.aoMint, { key: 'wSleeveT', pat: pat.stripes('rgba(255,255,255,0.2)', 6, 30, 0.6) });
  cut(ellipsePts(px + 120, py + 90, 150, 105, 0.5, 24), PAL.skin2, { key: 'wHandT' });
  cut(ellipsePts(px + 30, py + 150, 60, 34, 1.2, 14), PAL.skin2, { key: 'wThumbT', sb: 4 });
  yearTag('Lớp 1');
  capStrip('nét chữ đầu tiên');
}

// ---- 3. Lớp 5: maps, a globe, paper stars; the teacher points up; she asks "vì sao?"
function sStars() {
  cut(rect(-330, -330, W + 660, H + 660, 0), PAL.navy, { key: 'sWall', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.10)', 4, 70) });
  // the map on the wall
  cut(rect(110, 380, 560, 360, 4), '#a8d4e6', { key: 'sMap', pat: pat.lines('rgba(255,255,255,0.3)', 40) });
  [[200, 470, 90, 60], [360, 520, 70, 110], [520, 470, 100, 70], [560, 640, 50, 40]].forEach(([x, y, rx, ry], i) => cut(ellipsePts(x, y, rx, ry, i, 18), PAL.green, { key: 'sLand' + i, sb: 3, sy: 2 }));
  // paper stars on strings, swaying (the next bridge object is the big one)
  [[760, 360, 50], [880, 470, 34], [700, 520, 30], [960, 330, 28]].forEach(([x, y, r], i) => { const sw = Math.sin(TT * 2 + i) * 10; ink([[x, 240], [x + sw, y - r]], { w: 2, color: '#cfc6b8', key: 'sStr' + i }); cut(starPts(x + sw, y, r, 5, -Math.PI / 2, 40), PAL.yellow, { key: 'sStar' + i, crayon: PAL.mustard, crAl: 0.4 }); });
  clock(960, 640, 70, 2, 10, 'sClock');
  // the teacher (glasses, tie) points at the big star
  figure(820, 1360, { kind: 'man', key: 'sT', s: 0.9, top: '#e9e3d4', bottom: '#4a4550', tie: PAL.blue, glasses: true, armR: 0.2, armL: 2.55 + Math.sin(TT * 2) * 0.05, mood: 'smile' });
  // the teacher's desk: the globe, a jar with the orange flower
  desk(40, 1180, 520, 'sDesk');
  cut(ellipsePts(200, 1060, 110, 110, 0, 40), '#5ba4d6', { key: 'sGlobe', pat: (bb) => { pat.lines('rgba(255,255,255,0.25)', 36)(bb); } });
  cut(ellipsePts(170, 1030, 46, 34, 0.4, 16), PAL.green, { key: 'sGlobeL1', shadow: false }); cut(ellipsePts(250, 1100, 30, 40, 0.2, 14), PAL.green, { key: 'sGlobeL2', shadow: false });
  cut(rect(185, 1170, 30, 14, 3), PAL.woodD, { key: 'sGlobeB' });
  cut(rect(400, 1080, 90, 100, 14), 'rgba(200,230,240,0.85)', { key: 'sJar' });
  flower(445, 1000, 0.75, 'sFlower');
  // she (Lớp 5, red scarf) raises her hand: "?"
  const q = popS(CU.why);
  const kid = figure(400, 1470, { kind: 'girl', key: 'sK', s: 1.0, top: C2.shirt, bottom: C2.navyS, scarf: true, armR: 2.7, armL: 0.25, mood: TT >= CU.why ? 'wow' : 'smile' });
  if (q > 0) tag('?', kid.handR[0] + 70, kid.handR[1] - 60, 110 * q, { tape: false, rot: 0.1 });
  yearTag('Lớp 5');
  capStrip('vì sao?');
}
