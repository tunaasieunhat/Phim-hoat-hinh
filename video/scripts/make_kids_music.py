"""Gentle piano bed for "Grown-ups vs. Kids" (original, synthesized, royalty-free).
Bright and bouncy for scenes 1–6, slower and calmer from scene 7, a soft ending. Length follows src/Kids/data.ts.
usage: python3 scripts/make_kids_music.py public/kids/music.wav [data.ts | data3.ts]"""
import json
import os
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(ROOT, 'src', 'Kids', sys.argv[2] if len(sys.argv) > 2 else 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
DUR = t + 0.5
CALM = starts[6]            # scene 7: the turn
SR = 44100
out = np.zeros((int(SR * DUR), 2))
N = lambda n: 440 * 2 ** ((n - 69) / 12)


def piano(f, length, vel):
    n = int(SR * length); t = np.arange(n) / SR
    env = np.exp(-t * 2.4) * (1 - np.exp(-t * 400))
    return sum(np.sin(2 * np.pi * f * k * t) * a * np.exp(-t * k * 0.6) for k, a in [(1, 1), (2, 0.42), (3, 0.16), (4, 0.07)]) * env * vel


def pad(f, length, vel):
    n = int(SR * length); t = np.arange(n) / SR
    env = np.minimum(1, t / 1.5) * np.minimum(1, (length - t) / 1.5)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.003 * t)) * env * vel


def add(sig, at, pan=0.0):
    i = int(at * SR); j = min(len(out), i + len(sig))
    if i >= len(out): return
    out[i:j, 0] += sig[:j - i] * (1 - pan) * 0.7
    out[i:j, 1] += sig[:j - i] * (1 + pan) * 0.7


# I - V - vi - IV in C (bright) ; vi - IV - I - V in C, slower (calm)
BRIGHT = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
CALMP = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]
MEL_B = [72, 74, 76, 79, 76, 74, 72, 74, 76, 72, 69, 72, 74, 76, 77, 74]
MEL_C = [76, 74, 72, 71, 72, 69, 67, 69, 72, 71, 69, 67]
t, ci, mi = 0.0, 0, 0
while t < DUR - 1:
    calm = t >= CALM
    beat = 60 / (70 if calm else 100)
    bass, tri = (CALMP if calm else BRIGHT)[ci % 4]
    span = 4 * beat
    add(pad(N(bass), span + 1.2, 0.05 if calm else 0.035), t)
    if calm:   # slow broken chords, a sparse melody
        for k, n in enumerate([tri[0], tri[1], tri[2], tri[1]]):
            add(piano(N(n), 2.4, 0.09), t + k * beat, -0.3)
        add(piano(N(MEL_C[mi % len(MEL_C)]), 3.0, 0.12), t + beat * 0.02, 0.3); mi += 1
        add(piano(N(MEL_C[mi % len(MEL_C)]), 3.0, 0.1), t + 2 * beat, 0.3); mi += 1
    else:      # bouncy staccato eighths, a melody on the beats
        arp = [tri[0], tri[2], tri[1], tri[2] + 12 - 12, tri[0] + 12, tri[2], tri[1], tri[2]]
        for k in range(8):
            add(piano(N(arp[k]), 0.5, 0.075 if k % 2 else 0.095), t + k * beat / 2, -0.25)
        add(piano(N(bass), 0.8, 0.12), t); add(piano(N(bass + 7), 0.8, 0.09), t + 2 * beat)
        if t > 3:
            for k in range(4):
                add(piano(N(MEL_B[mi % len(MEL_B)]), 1.0, 0.1), t + k * beat, 0.3); mi += 1
    t += span; ci += 1

for d, g in [(0.09, 0.3), (0.14, 0.26), (0.21, 0.2), (0.3, 0.15)]:     # a little room
    k = int(d * SR)
    out[k:, 0] += out[:-k, 1] * g; out[k:, 1] += out[:-k, 0] * g
fi, fo = int(1.5 * SR), int(5 * SR)
out[:fi] *= np.linspace(0, 1, fi)[:, None]; out[-fo:] *= np.linspace(1, 0, fo)[:, None]
out /= np.max(np.abs(out)) / 0.85
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print(f'{DUR:.1f}s, calm from {CALM:.1f}s -> {sys.argv[1]}')
