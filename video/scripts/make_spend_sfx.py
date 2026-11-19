"""Synthesized SFX for "6 Types of Students When Spending Money" (no samples, free to use):
taps.wav (fast phone tapping), doorbell.wav (ding-dong), knock.wav (three knocks), rattle.wav (a wallet shaking),
bus.wav (a bus whooshing past), cheer.wav (a café crowd cheering). usage: python3 scripts/make_spend_sfx.py"""
import os, wave
import numpy as np
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'audio')
rng = np.random.default_rng(11)
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.85
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def tone(f, d, decay=6.0):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.4 * t)) * np.exp(-t * decay)
def place(n, parts):
    x = np.zeros(n)
    for t0, p in parts:
        i = int(t0 * SR); x[i:i + len(p)] += p[:max(0, n - i)]
    return x
# taps: 22 short glassy clicks with jitter
n = int(2.4 * SR); click = lambda: rng.normal(0, 1, 400) * np.exp(-np.arange(400) / 40) + 0.5 * tone(3200, 0.02, 200)[:400]
save('taps.wav', place(n, [(i * 0.1 + rng.uniform(0, 0.03), click()) for i in range(22)]))
# doorbell: ding (E5) – dong (C5)
save('doorbell.wav', place(int(1.8 * SR), [(0, tone(659, 1.0, 3.0)), (0.45, tone(523, 1.3, 2.5))]))
# knock: three wooden thuds
knock = lambda: (np.sin(2 * np.pi * 180 * np.arange(3000) / SR) + rng.normal(0, 0.6, 3000)) * np.exp(-np.arange(3000) / 500)
save('knock.wav', place(int(1.0 * SR), [(0, knock()), (0.18, knock()), (0.36, knock())]))
# rattle: coins and leather trembling (amplitude-modulated noise + tiny pings)
t = np.arange(int(1.6 * SR)) / SR
rat = rng.normal(0, 1, len(t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * t))) * 0.3
rat = rat - np.convolve(rat, np.ones(30) / 30, 'same')
save('rattle.wav', rat + place(len(t), [(rng.uniform(0, 1.4), tone(rng.uniform(2500, 4000), 0.08, 40)) for _ in range(12)]))
# bus: engine rumble + doppler whoosh
t = np.arange(int(2.6 * SR)) / SR
pos = (t - 1.2) * 18.0; amp = 1 / (1 + pos ** 2 / 60)
f0 = 70 * (1 + 0.15 * np.tanh(-pos / 8))
eng = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) * 0.4
wh = rng.normal(0, 1, len(t)); wh = np.convolve(wh, np.ones(12) / 12, 'same')
save('bus.wav', (eng + wh) * amp)
# cheer: crowd swell with "woo" glides
n = int(3.0 * SR); t = np.arange(n) / SR
x = np.convolve(rng.normal(0, 1, n), np.ones(20) / 20, 'same') * 0.6
for _ in range(30):
    t0 = rng.uniform(0, 2.3); d = rng.uniform(0.3, 0.7); f = rng.uniform(300, 600); i0 = int(t0 * SR); m = int(d * SR); tt = np.arange(m) / SR
    x[i0:i0 + m] += np.sin(2 * np.pi * (f * tt + 120 * tt ** 2)) * np.sin(np.pi * tt / d) * rng.uniform(0.2, 0.5)
save('cheer.wav', x * np.minimum(1, t / 0.3) * np.minimum(1, (3.0 - t) / 0.8))
print('taps doorbell knock rattle bus cheer ->', OUT)
