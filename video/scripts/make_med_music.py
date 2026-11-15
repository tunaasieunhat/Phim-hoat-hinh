"""Music and the alarm sound for "POV: A Day in the Life of a Med Student" (original, synthesized, royalty-free).
Playful lo-fi (soft keys, kick, hats, vinyl crackle) for scenes 1–3, a touching piano from scene 4, a soft ending.
Also writes an alarm-clock beep (public/med/sfx/alarm.wav). Length follows src/Med/data.ts.
usage: python3 scripts/make_med_music.py"""
import json
import os
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(ROOT, 'src', 'Med', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
END_HOLD = 3.0                          # the final card holds a little longer (see MedVideo.tsx)
DUR = t + END_HOLD + 0.3
TURN = starts[3]                        # scene 4: the memory of bed twelve
SR = 44100
N = lambda n: 440 * 2 ** ((n - 69) / 12)
rng = np.random.default_rng(7)


def write(path, x, ch=2):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.85
    with wave.open(path, 'wb') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def keys(f, length, vel, soft=True):           # a mellow electric-piano-ish tone
    n = int(SR * length); t = np.arange(n) / SR
    env = np.exp(-t * (1.6 if soft else 2.4)) * (1 - np.exp(-t * 200))
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    tone = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3.01 * f * t)
    return tone * env * vel * trem


def piano(f, length, vel):
    n = int(SR * length); t = np.arange(n) / SR
    env = np.exp(-t * 2.0) * (1 - np.exp(-t * 400))
    return sum(np.sin(2 * np.pi * f * k * t) * a * np.exp(-t * k * 0.5) for k, a in [(1, 1), (2, 0.4), (3, 0.15), (4, 0.06)]) * env * vel


def kick(vel):
    t = np.arange(int(SR * 0.35)) / SR
    return np.sin(2 * np.pi * (50 + 70 * np.exp(-t * 30)) * t) * np.exp(-t * 9) * vel


def hat(vel):
    n = int(SR * 0.06); x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))          # brighter
    return x * np.exp(-np.arange(n) / SR * 60) * vel


out = np.zeros((int(SR * DUR), 2))


def add(sig, at, pan=0.0):
    i = int(at * SR); j = min(len(out), i + len(sig))
    if i >= len(out) or j <= i: return
    out[i:j, 0] += sig[:j - i] * (1 - pan) * 0.7
    out[i:j, 1] += sig[:j - i] * (1 + pan) * 0.7


# --- lo-fi, 82 bpm, swung eighths: Fmaj7 - Em7 - Dm7 - Cmaj7
beat = 60 / 82
LOFI = [(41, [57, 60, 64, 65]), (40, [55, 59, 62, 64]), (38, [53, 57, 60, 62]), (36, [52, 55, 59, 60])]
MEL = [76, 74, 72, 74, None, 72, 69, 72, 74, None, 76, 79, 77, 76, 74, None]
t, ci, mi = 0.0, 0, 0
while t < TURN - 0.5:
    bass, ch = LOFI[ci % 4]
    for n in ch: add(keys(N(n), 4 * beat + 0.4, 0.05), t + 0.02 * (n % 3), -0.2)
    add(keys(N(bass), 4 * beat, 0.11), t)
    for b in range(4):
        add(kick(0.32 if b % 2 == 0 else 0.0), t + b * beat)
        if b % 2 == 1: add(hat(0.05) * 2.5, t + b * beat, 0.1)          # soft snare-ish hit
        for e in range(2): add(hat(0.035), t + b * beat + e * beat * 0.58, 0.3)
    if t > 2.5:
        for b in range(4):
            m = MEL[mi % len(MEL)]; mi += 1
            if m: add(keys(N(m), beat * 1.2, 0.07), t + b * beat + (0.03 if b % 2 else 0), 0.25)
    t += 4 * beat; ci += 1
lofi_end = t
# vinyl crackle under the lo-fi section
for c in rng.uniform(0, lofi_end, int(lofi_end * 9)):
    add(rng.standard_normal(60) * np.exp(-np.arange(60) / 8) * 0.03, c, rng.uniform(-0.6, 0.6))

# --- touching piano from the turn, 64 bpm: Am - F - C - G, a slow melody
beat = 60 / 64
PIANO = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]
MEL2 = [76, 74, 72, 74, 76, 79, 77, 76, 74, 72, 71, 72]
t, ci, mi = TURN, 0, 0
while t < DUR - 2:
    bass, ch = PIANO[ci % 4]
    add(piano(N(bass), 4 * beat, 0.13), t, -0.1)
    arp = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1]]
    for k in range(8): add(piano(N(arp[k % 6]), 1.8, 0.06), t + k * beat / 2, -0.3)
    if t > TURN + 4 * beat:
        for k in range(2): add(piano(N(MEL2[mi % len(MEL2)]), 2.6, 0.12), t + k * 2 * beat, 0.3); mi += 1
    t += 4 * beat; ci += 1

for d, g in [(0.08, 0.3), (0.13, 0.25), (0.2, 0.2), (0.29, 0.15)]:
    k = int(d * SR); out[k:, 0] += out[:-k, 1] * g; out[k:, 1] += out[:-k, 0] * g
fade = lambda a, b: np.linspace(a, b, int(1.6 * SR))[:, None]
i = int(TURN * SR); out[i - int(1.6 * SR):i] *= fade(1, 0.35)          # dip into the memory
out[:int(1.2 * SR)] *= np.linspace(0, 1, int(1.2 * SR))[:, None]
out[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
os.makedirs(os.path.join(ROOT, 'public', 'med', 'sfx'), exist_ok=True)
write(os.path.join(ROOT, 'public', 'med', 'music.wav'), out)

# --- the alarm clock: three bursts of four quick beeps (two clocks a little out of step)
a = np.zeros(int(SR * 2.6))
for burst in range(3):
    for k in range(4):
        for f0, dt in [(2100, 0.0), (2600, 0.035)]:
            i = int(SR * (burst * 0.85 + k * 0.12 + dt)); n = int(SR * 0.07); tt = np.arange(n) / SR
            a[i:i + n] += np.sign(np.sin(2 * np.pi * f0 * tt)) * 0.3 * np.minimum(1, (n - np.arange(n)) / 200)
write(os.path.join(ROOT, 'public', 'med', 'sfx', 'alarm.wav'), np.stack([a, a], 1))
print(f'music {DUR:.1f}s (lo-fi until {lofi_end:.1f}s, piano from {TURN:.1f}s); alarm.wav')
