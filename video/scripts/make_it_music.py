"""Music and sound effects for "POV: A Day in the Life of an IT Student" (original, synthesized, royalty-free).
A bouncy chiptune/lo-fi loop that cuts out for one second before every punchline (times from src/IT/data.ts),
plus the effects named in the script: an error chime (2), crickets (4), fireworks (5) and a grinding printer (6).
usage: python3 scripts/make_it_music.py"""
import json
import os
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(ROOT, 'src', 'IT', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
PUNCH = {(1, 4), (2, 8), (3, 4), (4, 6), (5, 3), (5, 6), (6, 4)}   # same as scripts/kids_narration.py
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
END_HOLD = 3.0
DUR = t + END_HOLD + 0.3
SR = 44100
N = lambda n: 440 * 2 ** ((n - 69) / 12)
rng = np.random.default_rng(11)
SFX = os.path.join(ROOT, 'public', 'it', 'sfx')
os.makedirs(SFX, exist_ok=True)


def write(path, x, peak=0.85):
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def sq(f, length, vel, duty=0.25, decay=6.0):        # chiptune pulse wave
    n = int(SR * length); tt = np.arange(n) / SR
    w = np.where((tt * f) % 1 < duty, 1.0, -1.0)
    return w * np.exp(-tt * decay) * (1 - np.exp(-tt * 400)) * vel * np.minimum(1, (n - np.arange(n)) / 300)


def tri(f, length, vel):
    n = int(SR * length); tt = np.arange(n) / SR
    return (2 * np.abs(2 * ((tt * f) % 1) - 1) - 1) * vel * np.minimum(1, (n - np.arange(n)) / 300) * (1 - np.exp(-tt * 300))


def kick(vel):
    tt = np.arange(int(SR * 0.3)) / SR
    return np.sin(2 * np.pi * (50 + 90 * np.exp(-tt * 35)) * tt) * np.exp(-tt * 10) * vel


def noise(length, vel, decay):
    n = int(SR * length); x = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return x * np.exp(-np.arange(n) / SR * decay) * vel


out = np.zeros((int(SR * DUR), 2))


def add(buf, sig, at, pan=0.0, g=0.7):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if i >= len(buf) or j <= i: return
    buf[i:j, 0] += sig[:j - i] * (1 - pan) * g
    buf[i:j, 1] += sig[:j - i] * (1 + pan) * g


# --- 104 bpm, C - Am - F - G, bass on the triangle, arpeggio + hook on pulse waves
beat = 60 / 104
PROG = [(36, [60, 64, 67]), (33, [57, 60, 64]), (29, [53, 57, 60]), (31, [55, 59, 62])]
HOOK = [72, None, 74, 76, None, 79, 76, None, 74, 72, None, 69, 72, None, None, None]
t, ci, hi = 0.0, 0, 0
while t < DUR - 3:
    bass, ch = PROG[ci % 4]
    for b in range(4):
        add(out, tri(N(bass + (12 if b % 2 else 0)), beat * 0.9, 0.22), t + b * beat)
        add(out, kick(0.35 if b % 2 == 0 else 0.0), t + b * beat)
        if b % 2: add(out, noise(0.12, 0.06, 30), t + b * beat, 0.1)
        add(out, noise(0.04, 0.025, 90), t + b * beat + beat / 2, 0.4)
        for e in range(2):
            add(out, sq(N(ch[(b * 2 + e) % 3] + 12), beat / 2, 0.035, 0.125, 9), t + b * beat + e * beat / 2, -0.35)
    if t > 4 * beat * 2:
        for b in range(4):
            m = HOOK[hi % len(HOOK)]; hi += 1
            if m: add(out, sq(N(m), beat * 0.8, 0.05, 0.5, 4), t + b * beat, 0.3)
    t += 4 * beat; ci += 1
for d, g in [(0.09, 0.22), (0.17, 0.15)]:
    k = int(d * SR); out[k:, 0] += out[:-k, 1] * g; out[k:, 1] += out[:-k, 0] * g

# silence for a beat before each punchline (1 s), back in after the line
gain = np.ones(len(out))
ramp = lambda a, b, n: np.linspace(a, b, n)
for (sn, si) in PUNCH:
    sc = scenes[sn - 1]; q = sc['sentences'][si]
    a = starts[sn - 1] + q['t0'] - 1.0; b = starts[sn - 1] + q['t1'] + 0.25
    i, j, r = int(a * SR), int(b * SR), int(0.12 * SR)
    gain[i:j] = 0; gain[i - r:i] = np.minimum(gain[i - r:i], ramp(1, 0, r)); gain[j:j + r] = np.minimum(gain[j:j + r], ramp(0, 1, r))
out *= gain[:, None]
out[:int(0.8 * SR)] *= np.linspace(0, 1, int(0.8 * SR))[:, None]
out[-int(3.5 * SR):] *= np.linspace(1, 0, int(3.5 * SR))[:, None]
write(os.path.join(ROOT, 'public', 'it', 'music.wav'), out)

# --- error chime: two soft bell tones falling a fifth (our own "something went wrong" sound)
e = np.zeros(int(SR * 1.2))
for f0, at in [(N(76), 0.0), (N(69), 0.16)]:
    n = int(SR * 1.0); tt = np.arange(n) / SR
    tone = sum(np.sin(2 * np.pi * f0 * k * tt) * a for k, a in [(1, 1), (2.01, 0.35), (3, 0.12)]) * np.exp(-tt * 4.5) * (1 - np.exp(-tt * 600))
    i = int(at * SR); e[i:i + n] += tone[:len(e) - i]
write(os.path.join(SFX, 'error.wav'), e)

# --- crickets: chirps of a 4.6 kHz tone, three pulses each, two crickets
c = np.zeros((int(SR * 4.0), 2))
for who, (f0, period, pan) in enumerate([(4600, 0.62, -0.5), (4250, 0.81, 0.5)]):
    tt0 = 0.1 + who * 0.27
    while tt0 < 3.7:
        for k in range(3):
            n = int(SR * 0.028); tt = np.arange(n) / SR
            add(c, np.sin(2 * np.pi * f0 * tt) * np.sin(np.pi * np.arange(n) / n) * 0.3, tt0 + k * 0.045, pan, 1)
        tt0 += period
write(os.path.join(SFX, 'crickets.wav'), c, 0.6)

# --- fireworks: a rising whistle, a boom and a crackle, twice
fw = np.zeros((int(SR * 3.4), 2))
for at, pan in [(0.0, -0.4), (0.7, 0.4)]:
    n = int(SR * 0.6); tt = np.arange(n) / SR
    add(fw, np.sin(2 * np.pi * np.cumsum(900 + 1400 * tt / 0.6) / SR) * 0.12 * (tt / 0.6), at, pan, 1)
    add(fw, kick(0.9) + noise(0.3, 0.5, 14)[:len(kick(0.9))], at + 0.6, pan, 1)
    for k in rng.uniform(0.7, 1.9, 40):
        add(fw, noise(0.03, rng.uniform(0.05, 0.2), 120), at + k, rng.uniform(-0.8, 0.8), 1)
write(os.path.join(SFX, 'fireworks.wav'), fw)

# --- a grinding printer: buzzing motor with stutters and a paper-jam crunch
n = int(SR * 3.0); tt = np.arange(n) / SR
motor = np.sign(np.sin(2 * np.pi * (110 + 30 * np.sin(2 * np.pi * 7 * tt)) * tt)) * 0.25
stutter = (np.sin(2 * np.pi * 3.2 * tt) > -0.3).astype(float)
pr = motor * stutter + rng.standard_normal(n) * 0.06 * stutter
pr += np.concatenate([np.zeros(int(SR * 2.2)), noise(0.8, 0.5, 6)])[:n]
write(os.path.join(SFX, 'printer.wav'), pr * np.minimum(1, (n - np.arange(n)) / 4000), 0.7)
print(f'music {DUR:.1f}s, sfx: error, crickets, fireworks, printer')
