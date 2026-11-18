"""Synthesized SFX for "What if everything was free?" (no samples, so free to use):
fanfare.wav (royal announcement), kaching.wav (cash register), crowd.wav (stampeding shoppers, ~4 s).
usage: python3 scripts/make_free_sfx.py  → public/audio/"""
import os, wave
import numpy as np
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'audio')
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.85
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())

def env(n, a=0.01, r=0.1):
    e = np.ones(n); ia, ir = int(a * SR), int(r * SR)
    e[:ia] = np.linspace(0, 1, ia); e[-ir:] = np.linspace(1, 0, ir); return e

def brass(f, d):
    t = np.arange(int(d * SR)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * t * vib) for k in range(1, 9))
    bright = np.minimum(1, t / 0.05)
    return x * env(len(t), 0.02, 0.08) * (0.6 + 0.4 * bright)

# fanfare: ta-ta-taaa (C major), two voices
notes = [(392, .14), (392, .14), (392, .14), (523, .55), (0, .06), (392, .16), (523, .7)]
seq = []
for f, d in notes:
    seq.append(np.zeros(int(d * SR)) if f == 0 else brass(f, d) + 0.6 * brass(f * 1.25, d))
save('fanfare.wav', np.concatenate(seq + [np.zeros(int(0.3 * SR))]))

# ka-ching: drawer clunk + two bright bells + coin shimmer
t = np.arange(int(1.1 * SR)) / SR
clunk = rng.normal(0, 1, len(t)) * np.exp(-t * 60) * 0.6
bell = lambda f, t0: np.where(t > t0, np.sin(2 * np.pi * f * (t - t0)) + 0.5 * np.sin(2 * np.pi * f * 2.76 * (t - t0)), 0) * np.exp(-np.maximum(t - t0, 0) * 5)
shimmer = rng.normal(0, 1, len(t)) * np.exp(-np.maximum(t - 0.12, 0) * 8) * (t > 0.12) * 0.25
shimmer = np.convolve(shimmer, np.ones(3) / 3, 'same') - np.convolve(shimmer, np.ones(40) / 40, 'same')
save('kaching.wav', clunk + 0.7 * bell(2093, 0.1) + 0.6 * bell(2637, 0.22) + shimmer)

# crowd: many low "voices" (formant-filtered noise bursts) + rumble of feet, swelling and fading
n = int(4.2 * SR); t = np.arange(n) / SR
x = np.zeros(n)
for i in range(60):
    t0 = rng.uniform(0, 3.8); d = rng.uniform(0.2, 0.6); f0 = rng.uniform(140, 320)
    i0, i1 = int(t0 * SR), min(n, int((t0 + d) * SR)); tt = np.arange(i1 - i0) / SR
    voice = np.sign(np.sin(2 * np.pi * f0 * tt * (1 + 0.1 * np.sin(2 * np.pi * 3 * tt)))) * np.sin(np.pi * tt / d) ** 2
    x[i0:i1] += voice * rng.uniform(0.2, 0.6)
x = np.convolve(x, np.hanning(30) / 15, 'same')            # soften to a "yelling" murmur
feet = rng.normal(0, 1, n); feet = np.convolve(feet, np.ones(200) / 200, 'same') * (1 + np.sign(np.sin(2 * np.pi * 7 * t))) * 3
shape = np.minimum(1, t / 0.6) * np.minimum(1, (4.2 - t) / 0.8)
save('crowd.wav', (x + feet) * shape)
print('fanfare.wav kaching.wav crowd.wav ->', OUT)
