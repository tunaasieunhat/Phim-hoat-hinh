"""Sounds for "Rainy day: plan vs. reality" -> public/audio/ (see CREDITS.md).
Copies CC0 / CC BY recordings from the stickman skill's audio library and synthesizes the rest.
usage: python3 scripts/make_rain_audio.py <path to b-audio-library/audio>"""
import os
import shutil
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB, A, SR = sys.argv[1], os.path.join(ROOT, 'public', 'audio'), 44100
rng = np.random.default_rng(21)
for dst, src in {
    'rain-loop.ogg': 'ylmir-rain/1.ogg',                       # Rain (loopable) — Ylmir, CC0
    'shutter.wav': 'owlish-home-202/Camera/Camera_02.wav',     # OwlishMedia, CC0
    'phone-ring.wav': 'owlish-home-202/Phone/Phone3.wav',      # OwlishMedia, CC0
    'thunder.ogg': 'rubberduck-general-100-2/sfx100v2_thunder_01.ogg',  # rubberduck, CC0
    'page.ogg': 'kenney-rpg/bookFlip2.ogg',                    # Kenney, CC0
    'music-plan.mp3': 'music/bgm-monkeys-spinning-monkeys.mp3',  # Kevin MacLeod, CC BY 4.0
    'music-reality.mp3': 'music/bgm-impact-moderato.mp3',        # Kevin MacLeod, CC BY 4.0
}.items():
    shutil.copy(os.path.join(LIB, src), os.path.join(A, dst))


def write(name, x, peak=0.85):
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(os.path.join(A, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def lp(x, k):            # one-pole low-pass; k may vary over time (the trombone mute opening)
    k = np.broadcast_to(k, x.shape)
    y = np.zeros_like(x); a = 0.0
    for i, v in enumerate(x):
        a += k[i] * (v - a); y[i] = a
    return y


def bp(x, f, q=6):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X *= np.exp(-((fr - f) / (f / q)) ** 2)
    return np.fft.irfft(X, len(x))


# "wah wah wah wahhh": a sad muted trombone, four falling notes, the last one wobbling
x = np.zeros(int(SR * 2.6))
for f, at, L in [(233.1, 0.0, 0.42), (220.0, 0.45, 0.42), (207.7, 0.9, 0.42), (196.0, 1.35, 1.2)]:
    n = int(SR * L); t = np.arange(n) / SR
    ff = f * (1 + (0.035 * np.sin(2 * np.pi * 6 * t) * (t > 0.25) if L > 1 else 0)) * (1 - 0.03 * t / L)
    saw = 2 * ((np.cumsum(ff) / SR) % 1) - 1
    wah = 0.5 + 0.5 * np.sin(np.pi * np.minimum(1, t / 0.3))          # the mute opening
    tone = lp(saw, 0.03 + 0.09 * wah) * np.minimum(1, t / 0.03) * np.minimum(1, (L - t) / 0.12)
    i = int(at * SR); x[i:i + n] += tone[:len(x) - i]
write('wahwah.wav', x, 0.8)

# noodle slurp: a rising, gurgling suck of filtered noise
n = int(SR * 1.1); t = np.arange(n) / SR
sl = np.zeros(n)
for k in range(n // 400):
    seg = slice(k * 400, k * 400 + 400)
    sl[seg] = bp(rng.standard_normal(400), 900 + 2400 * t[k * 400] / 1.1, 2) * (0.5 + 0.5 * np.sin(k * 1.7))
write('slurp.wav', sl * np.minimum(1, t / 0.08) * np.minimum(1, (1.1 - t) / 0.15), 0.6)
print('ok: rain-loop, shutter, phone-ring, thunder, page, music-plan, music-reality, wahwah, slurp')
