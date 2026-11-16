"""Music and sound effects for "5 Types of Teams" (original, synthesized, royalty-free; the laugh is Edge TTS voices).
One short style per team, following the production notes:
  intro: light and curious · productive: quick, tidy plucks · argument: rolling drums · "later": lazy swing that
  turns into an alarm pulse after the Thursday-night jump · fun: party beat · balanced + ending: warm keys.
Effects: ting (team sign), siren (scene 4), laugh (scene 5); the calendar flip reuses public/med/sfx/page-flip.ogg.
usage: SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/make_teams_music.py"""
import asyncio
import json
import os
import shutil
import subprocess
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(ROOT, 'src', 'Teams', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
END_HOLD = 3.0
DUR = t + END_HOLD + 0.3
SR = 44100
N = lambda n: 440 * 2 ** ((n - 69) / 12)
rng = np.random.default_rng(5)
SFX = os.path.join(ROOT, 'public', 'teams', 'sfx')
os.makedirs(SFX, exist_ok=True)


def write(path, x, peak=0.85):
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def env(n, a=400, d=6.0):
    tt = np.arange(n) / SR
    return np.exp(-tt * d) * (1 - np.exp(-tt * a)) * np.minimum(1, (n - np.arange(n)) / 300)


def pluck(f, L, v, d=7.0):
    n = int(SR * L); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) + 0.1 * np.sin(6 * np.pi * f * tt)) * env(n, 800, d) * v


def keys(f, L, v):
    n = int(SR * L); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)) * env(n, 120, 1.4) * v * (1 + 0.06 * np.sin(2 * np.pi * 4.5 * tt))


def bass(f, L, v):
    n = int(SR * L); tt = np.arange(n) / SR
    return np.tanh(2 * np.sin(2 * np.pi * f * tt)) * env(n, 300, 3) * v


def kick(v):
    tt = np.arange(int(SR * 0.3)) / SR
    return np.sin(2 * np.pi * (48 + 90 * np.exp(-tt * 32)) * tt) * np.exp(-tt * 9) * v


def noise(L, v, d):
    n = int(SR * L); x = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return x * np.exp(-np.arange(n) / SR * d) * v


def tom(f, v):
    tt = np.arange(int(SR * 0.35)) / SR
    return np.sin(2 * np.pi * (f + f * 0.6 * np.exp(-tt * 20)) * tt) * np.exp(-tt * 8) * v


out = np.zeros((int(SR * DUR), 2))


def add(buf, sig, at, pan=0.0, g=0.7):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if i < 0 or i >= len(buf) or j <= i: return
    buf[i:j, 0] += sig[:j - i] * (1 - pan) * g
    buf[i:j, 1] += sig[:j - i] * (1 + pan) * g


def section(a, b, bpm, fn):
    beat = 60 / bpm; t, bar = a, 0
    while t < b - 0.05:
        fn(t, beat, bar); t += 4 * beat; bar += 1


def intro(t, beat, bar):           # light, curious: C - F - G - C plucks
    ch = [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]][bar % 4]
    add(out, bass(N(ch[0] - 24), 4 * beat, 0.16), t)
    for k in range(8): add(out, pluck(N(ch[k % 3] + 12), beat, 0.05), t + k * beat / 2, 0.3 * (-1) ** k)
    for b in range(4): add(out, kick(0.2 if b % 2 == 0 else 0), t + b * beat); add(out, noise(0.03, 0.02, 80), t + b * beat + beat / 2, 0.3)


def productive(t, beat, bar):      # quick and tidy: staccato sixteenths, D major, steady kick
    ch = [[62, 66, 69], [67, 71, 74], [64, 67, 71], [69, 73, 76]][bar % 4]
    add(out, bass(N(ch[0] - 24), 4 * beat, 0.18), t)
    for k in range(16): add(out, pluck(N(ch[k % 3] + (12 if k % 4 == 3 else 0)), beat / 4, 0.045, 18), t + k * beat / 4, 0.25 * (-1) ** k)
    for b in range(4): add(out, kick(0.3), t + b * beat); add(out, noise(0.03, 0.03, 90), t + b * beat + beat / 2, 0.3)


def argument(t, beat, bar):        # rolling drums, a tense minor bass
    add(out, bass(N([40, 41, 40, 43][bar % 4]), 4 * beat, 0.2), t)
    for k in range(16):
        add(out, tom([110, 140, 90, 170][k % 4], 0.22 if k % 2 == 0 else 0.12), t + k * beat / 4, 0.4 * np.sin(k))
    if bar % 2 == 1:
        for k in range(12): add(out, noise(0.05, 0.05 + k * 0.006, 40), t + 3 * beat + k * beat / 12, 0.2)
    add(out, kick(0.35), t); add(out, kick(0.35), t + 2 * beat)


def lazy(t, beat, bar):            # lazy swing: slow, sleepy keys and a walking bass
    ch = [[57, 60, 64, 67], [62, 65, 69, 72]][bar % 2]
    for n in ch: add(out, keys(N(n), 4 * beat, 0.035), t, -0.2)
    for b in range(4): add(out, pluck(N([45, 48, 50, 52, 50, 48, 47, 45][(bar * 4 + b) % 8] - 12), beat * 0.9, 0.16, 4), t + b * beat + (0.08 if b % 2 else 0))
    for b in range(4): add(out, noise(0.08, 0.02, 30), t + b * beat + beat * 0.66, 0.4)


def alarm(t, beat, bar):           # panic: fast pulsing minor stabs
    for k in range(8): add(out, pluck(N([69, 72, 76][k % 3]), beat / 2, 0.06, 10), t + k * beat / 2, 0.3 * (-1) ** k)
    for b in range(4): add(out, kick(0.38), t + b * beat); add(out, noise(0.05, 0.05, 50), t + b * beat + beat / 2)
    add(out, bass(N(45), 4 * beat, 0.2), t)


def party(t, beat, bar):           # party: four on the floor, offbeat hats, bright stabs
    ch = [[65, 69, 72], [67, 71, 74], [64, 67, 72], [69, 72, 76]][bar % 4]
    add(out, bass(N(ch[0] - 24), 4 * beat, 0.16), t)
    for b in range(4):
        add(out, kick(0.38), t + b * beat); add(out, noise(0.05, 0.05, 50), t + b * beat + beat / 2, 0.3)
        if b % 2: add(out, noise(0.12, 0.07, 25), t + b * beat, -0.1)
        for n in ch: add(out, pluck(N(n + 12), beat * 0.3, 0.035, 12), t + b * beat + beat / 2, 0.2)


def warm(t, beat, bar):            # warm keys: F - C - Dm - Bb, soft melody
    ch = [[53, 57, 60, 65], [48, 52, 55, 64], [50, 53, 57, 62], [46, 50, 53, 62]][bar % 4]
    for n in ch[1:]: add(out, keys(N(n + 12), 4 * beat, 0.04), t, -0.2)
    add(out, keys(N(ch[0] - 12), 4 * beat, 0.12), t)
    mel = [[72, 69], [67, 72], [69, 65], [65, 67]][bar % 4]
    for i, m in enumerate(mel): add(out, keys(N(m + 12), 2 * beat, 0.05), t + i * 2 * beat, 0.3)
    for b in range(4): add(out, noise(0.03, 0.012, 80), t + b * beat + beat / 2, 0.4)


ends = starts[1:] + [DUR]
jump = starts[3] + scenes[3]['marks'][0]['t'] if scenes[3]['marks'] else starts[3] + 10
section(0, ends[0], 104, intro)
section(starts[1], ends[1], 124, productive)
section(starts[2], ends[2], 112, argument)
section(starts[3], jump, 72, lazy)
section(jump, ends[3], 140, alarm)
section(starts[4], ends[4], 124, party)
section(starts[5], DUR - 1.5, 88, warm)
for d, g in [(0.09, 0.2), (0.17, 0.12)]:
    k = int(d * SR); out[k:, 0] += out[:-k, 1] * g; out[k:, 1] += out[:-k, 0] * g
# short fades at each style change so the cuts are clean
for b in starts[1:] + [jump]:
    i = int(b * SR); r = int(0.12 * SR)
    out[i - r:i] *= np.linspace(1, 0, r)[:, None]; out[i:i + r] *= np.linspace(0, 1, r)[:, None]
out[:int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))[:, None]
out[-int(3.5 * SR):] *= np.linspace(1, 0, int(3.5 * SR))[:, None]
write(os.path.join(ROOT, 'public', 'teams', 'music.wav'), out)

# ting: a bright bell for the team signs
n = int(SR * 1.0); tt = np.arange(n) / SR
ting = sum(np.sin(2 * np.pi * N(88) * k * tt) * a * np.exp(-tt * (3 + k)) for k, a in [(1, 1), (2.76, 0.4), (5.4, 0.15)]) * (1 - np.exp(-tt * 900))
write(os.path.join(SFX, 'ting.wav'), ting, 0.7)
# siren: a wailing tone
n = int(SR * 2.6); tt = np.arange(n) / SR
f0 = 700 + 350 * (0.5 - 0.5 * np.cos(2 * np.pi * tt / 0.65))
sir = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) * 0.3 + np.sin(2 * np.pi * np.cumsum(f0 * 2) / SR) * 0.15
write(os.path.join(SFX, 'siren.wav'), sir * np.minimum(1, (n - np.arange(n)) / 6000), 0.6)
shutil.copy(os.path.join(ROOT, 'public', 'med', 'sfx', 'page-flip.ogg'), os.path.join(SFX, 'page-flip.ogg'))


# laugh: three voices laughing, a little out of step
async def laughs():
    import edge_tts
    tmp = os.path.join(ROOT, '.kids-tts', 'teams'); os.makedirs(tmp, exist_ok=True)
    takes = []
    for i, (v, txt, p) in enumerate([('en-US-GuyNeural', 'Ha ha ha ha!', '+8Hz'), ('en-US-AriaNeural', 'Hahaha, ha ha!', '+10Hz'), ('en-US-ChristopherNeural', 'Ha ha, haha!', '+4Hz')]):
        mp3 = os.path.join(tmp, f'laugh{i}.mp3')
        for attempt in range(6):
            if os.path.exists(mp3) and os.path.getsize(mp3) > 1000: break
            try:
                await edge_tts.Communicate(txt, v, rate='+15%', pitch=p, proxy=os.environ.get('HTTPS_PROXY')).save(mp3)
            except Exception:  # noqa: BLE001
                await asyncio.sleep(2 * (attempt + 1))
        r = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
        takes.append(np.frombuffer(r.stdout, np.int16).astype(float) / 32768)
    buf = np.zeros((int(SR * 2.6), 2))
    for i, x in enumerate(takes): add(buf, x, 0.05 + i * 0.18, [-0.5, 0.5, 0][i], 1)
    write(os.path.join(SFX, 'laugh.wav'), buf, 0.8)
asyncio.run(laughs())
print(f'music {DUR:.1f}s; sfx: ting, siren, page-flip, laugh')
