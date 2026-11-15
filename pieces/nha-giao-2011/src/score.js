  // ================= TRI ÂN THẦY CÔ: the arc =================
  // thin and warm (Lớp 1: a school drum, a music-box pluck) -> brighter (Lớp 5: chimes for the stars)
  // -> cold (Lớp 9: rain, a low drone, A minor) -> warm again (the umbrella: F major) -> the fullest (18: the groove)
  // -> near silence (20 năm sau: the empty room) -> the hard cut: the loudest hit -> warm (the small hand) -> the motif, fading
  // The flower's motif: a rising fifth (C5 -> G5), every time the orange flower is given.
  const T = TIMELINE, cu = T.cues, [T1, T2, T3, T4, T5, T7, T8] = T.morphs, CUTT = T.cuts[0], END = T.duration;
  const hush0 = VL('l07-return').t1 + 0.1;
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const motif = (t, vel) => [['C5', 0], ['G5', E8]].forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.15 - i * 0.3, 0.8, 2600, 0.4));
  const FIG = { C: ['C4', 'G4', 'E4', 'G4', 'C5', 'G4', 'E4', 'G4'], G: ['B3', 'G4', 'D4', 'G4', 'B4', 'G4', 'D4', 'G4'],
    Am: ['A3', 'E4', 'C4', 'E4', 'A4', 'E4', 'C4', 'E4'], F: ['A3', 'F4', 'C4', 'F4', 'A4', 'F4', 'C4', 'F4'] };
  const PROG = ['C', 'G', 'Am', 'F'], BASS = { C: 'C3', G: 'G2', Am: 'A2', F: 'F2' }, PADN = { C: ['C3', 'G3', 'E4'], G: ['G2', 'D3', 'B3'], Am: ['A2', 'E3', 'C4'], F: ['F2', 'C3', 'A3'] };

  to = 'm';
  // 1. Lớp 1: a soft pad, quarter plucks like a music box; the motif when she lifts the flower
  pad(0.0, T2 + 0.1, ['C3', 'G3', 'E4'], 0.03, { type: 'triangle', cut: 800, att: 0.6, rel: 0.4 });
  each(2.0, T2, BEAT, (t, k) => pluck(t, nz(FIG[PROG[Math.floor(k / 4) % 4]][(k * 2) % 8]), 0.05, Math.sin(k) * 0.3, 0.5, 2400, 0.3));
  motif(cu.give, 0.16);
  // 2. Lớp 5: 8th plucks, a bass on the beat, chimes for the stars and for "vì sao?"
  pad(T2, T3 + 0.1, ['C3', 'G3', 'D4'], 0.032, { cut: 1000, att: 0.3, rel: 0.3, send: 0.3 });
  each(T2, T3, E8, (t, k) => { const ch = PROG[Math.floor(k / 8) % 4]; pluck(t, nz(FIG[ch][k % 8]), 0.055 * (k % 2 ? 0.75 : 1), Math.sin(k * 0.9) * 0.3, 0.32, 3000, 0.22); if (k % 2 === 0) bass(t, nz(BASS[ch]), 0.14); });
  // 3. Lớp 9: rain — a cold drone in A minor, a high note now and then
  drone(T3, T4 - 3.6, nz('A2'), 0.04, { att: 0.5, rel: 0.6 });
  pad(T3, cu.umbrella + 0.2, ['A2', 'E3', 'C4'], 0.022, { type: 'triangle', cut: 600, att: 0.6, rel: 0.6 });
  [T3 + 0.5, T3 + 2.0, T3 + 3.5].forEach((t, i) => pluck(t, nz(['E5', 'C5', 'A4'][i]), 0.035, 0.3 - i * 0.3, 1.0, 1800, 0.6));
  // the umbrella: warm again, F -> C, plucks come back
  pad(cu.umbrella, T4 + 0.1, ['F2', 'C3', 'A3', 'C4'], 0.036, { cut: 1200, att: 0.5, rel: 0.2, send: 0.35 });
  each(cu.umbrella, T4, E8, (t, k) => pluck(t, nz(FIG[k < 8 ? 'F' : 'C'][k % 8]), 0.05, Math.sin(k) * 0.3, 0.4, 2800, 0.3));
  motif(cu.redo + 0.25, 0.14);
  // 4. Eighteen: the groove, the fullest — 16ths, bass, sub, hats; the bus world holds the last bar
  pad(T4, T5 + 0.1, ['C3', 'G3', 'E4', 'G4'], 0.026, { cut: 1100, att: 0.2, rel: 0.1, send: 0.2 });
  each(T4, T5, E16, (t, k) => {
    const ch = PROG[Math.floor(k / 8) % 4], acc = k % 4 === 0 ? 1.25 : k % 2 === 0 ? 1.0 : 0.75;
    pluck(t, nz(FIG[ch][k % 8]), 0.044 * acc, Math.sin(k * 0.9) * 0.4, 0.26, 4000, 0.15);
    if (k % 2 === 0) bass(t, nz(BASS[ch]), 0.12);
    if (k % 4 === 2) noiseHit(t, 0.02, 'highpass', 8000, 0.7, 0.024, k % 8 ? 0.3 : -0.3);
  });
  // 5. Twenty years later: the room — a thin pad under the line, then it stops dead (silence from hush0 to the cut)
  pad(T5, hush0 - 0.05, ['C3', 'G3'], 0.016, { type: 'triangle', cut: 500, att: 0.8, rel: 0.05, send: 0.0 });
  pluck(T5 + 0.6, nz('E5'), 0.03, 0.2, 1.2, 1600, 0.0);
  // 6. THE CUT: the loudest hit — a short stab + sub, then a flat warm chord (payoff recipe)
  ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'].forEach((n, i) => pluck(CUTT, nz(n), 0.3, (i - 2.5) * 0.12, 0.5, 5600, 0.25));
  sub(CUTT, 0.45); bass(CUTT, nz('C2'), 0.38); noiseHit(CUTT, 0.12, 'lowpass', 220, 0.8, 0.12);
  pad(CUTT + 0.1, T7 + 0.1, ['C3', 'G3', 'E4', 'G4'], 0.042, { cut: 1600, att: 0.15, rel: 0.2, send: 0.45 });
  // 7. The small hand: warm, sparse; the motif on the offered flower
  pad(T7, T8 + 0.1, ['F2', 'C3', 'A3', 'E4'], 0.034, { cut: 1200, att: 0.4, rel: 0.2, send: 0.4 });
  each(T7, T8, BEAT, (t, k) => pluck(t, nz(FIG[k < 4 ? 'F' : 'C'][(k * 2) % 8]), 0.045, Math.sin(k) * 0.3, 0.5, 2600, 0.3));
  motif(cu.offer, 0.16);
  // 8. Thanks: the bouquet blooms on 8ths, the motif, a long fade
  pad(T8, END, ['C3', 'G3', 'E4', 'C5'], 0.032, { cut: 1400, att: 0.4, rel: 1.6, send: 0.5 });
  each(T8 + 0.15, T8 + 1.0, E8 / 2, (t, k) => pluck(t, nz(['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'][k % 7]), 0.035, 0.3 - k * 0.1, 0.4, 4200, 0.4));
  motif(cu.thanks, 0.14);
  pluck(END - 2.6, nz('C4'), 0.05, 0, 2.0, 1800, 0.6);

  to = 's';
  // the school drum (trống trường): tùng tùng tùng
  [0.35, 0.85, 1.35].forEach((t) => { noiseHit(t, 0.25, 'lowpass', 140, 0.8, 0.09); sub(t, 0.09); });
  // pencil scratches on the write-ons
  each(cu.write, cu.write + 2.2, E16, (t, k) => { if (k % 3 !== 2) noiseHit(t, 0.06, 'bandpass', 3800, 2.5, 0.012, 0.2); });
  // chimes: the stars and "vì sao?"
  chime(T2 + 0.5, [nz('G5'), nz('D6')], 0.03, 0.4); chime(cu.why, [nz('E6'), nz('B6')], 0.04, -0.2);
  // rain: a band of noise until the umbrella opens (a quieter patter under it after)
  each(T3, T4 - 0.2, 0.25, (t, k) => noiseHit(t, 0.3, 'bandpass', 2600, 0.6, t < cu.umbrella ? 0.014 : 0.006, Math.sin(k) * 0.4));
  noiseHit(cu.umbrella + 0.3, 0.12, 'bandpass', 1400, 1.5, 0.03, 0.1);   // the umbrella snaps open
  noiseHit(cu.redo, 0.18, 'bandpass', 2400, 1.0, 0.02, 0.2);              // the paper crumples
  // paper swishes into every morph
  T.morphs.forEach((tc) => sweep(tc - 0.35, tc + 0.05, 0.011, 500, 2600, 0));
  // the door creaks open in the empty room
  blip(cu.door + 0.1, 220, 180, 0.6, 0.012, -0.3);
  // confetti sparkle on the title
  each(cu.thanks, cu.thanks + 1.2, E16, (t, k) => blip(t, 2600 + (k * 431) % 1800, 3200, 0.05, 0.008, Math.sin(k) * 0.5));
