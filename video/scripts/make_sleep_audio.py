"""Sound effects for "What Happens If You Don't Get Enough Sleep?" -> public/audio/.
Free recordings are copied from the stickman skill's audio library (CC0 / CC BY, see public/audio/CREDITS.md);
the rest are synthesized here (original, royalty-free).
usage: python3 scripts/make_sleep_audio.py <path to b-audio-library/audio>"""
import os
import shutil
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = sys.argv[1]
A = os.path.join(ROOT, 'public', 'audio')
os.makedirs(A, exist_ok=True)
SR = 44100
rng = np.random.default_rng(3)

COPY = {
    'music-comedy.mp3': 'music/bgm-merry-go.mp3',           # silent-film comedy (Kevin MacLeod, CC BY 4.0)
    'music-warm.mp3': 'music/bgm-morning.mp3',              # warm ending (Kevin MacLeod, CC BY 4.0)
    'music-loading.mp3': 'music/bgm-local-forecast-elevator.mp3',  # "waiting" music (Kevin MacLeod, CC BY 4.0)
    'swipe.wav': 'artisticdude-swishes/swish-7.wav',        # CC0
    'swipe2.wav': 'artisticdude-swishes/swish-3.wav',       # CC0
    'ding.mp3': 'ez-boings/bing_01_0.mp3',                  # CC0
    'boing.flac': 'aeva-boing/boing.flac',                  # CC0
    'bounce.flac': 'bf-cartoon-bounce/BounceYoFrankie.flac',  # CC BY 3.0 (Blender Foundation)
    'birds.ogg': 'isaiah-birds/birds-isaiah658_0.ogg',      # CC0
    'slide-whistle.wav': 'joedeshon-slide-whistle/79671__joedeshon__slide-whistle-down-01.wav',  # CC BY 3.0
    # scenes 4-9 (all CC0: Kenney, rubberduck, OwlishMedia)
    'splash.ogg': 'rubberduck-water-40/splash_03.ogg',
    'bonk.ogg': 'kenney-impact/impactMetal_heavy_000.ogg',
    'bonk2.ogg': 'kenney-impact/impactMetal_heavy_002.ogg',
    'thud.ogg': 'kenney-impact/impactSoft_heavy_000.ogg',
    'alert.ogg': 'kenney-interface/error_006.ogg',
    'ping.ogg': 'kenney-interface/glass_004.ogg',
    'gulp.wav': 'owlish-home-202/Drink/Drink_02.wav',
    'charge.ogg': 'kenney-digital/powerUp1.ogg',
    'lock.ogg': 'kenney-rpg/metalLatch.ogg',
}
for dst, src in COPY.items():
    shutil.copy(os.path.join(LIB, src), os.path.join(A, dst))


def write(name, x, peak=0.85):
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(os.path.join(A, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def lp(x, k):            # cheap one-pole low-pass
    y = np.zeros_like(x); a = 0.0
    for i, v in enumerate(x):
        a += k * (v - a); y[i] = a
    return y


def bp(x, f, q=6):       # resonant band-pass via FFT mask
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X *= np.exp(-((fr - f) / (f / q)) ** 2)
    return np.fft.irfft(X, len(x))


# clock tick (a short wooden click)
n = int(SR * 0.06); t = np.arange(n) / SR
write('tick.wav', bp(rng.standard_normal(n), 2600, 3) * np.exp(-t * 120), 0.6)

# alarm clock: three bursts of quick beeps
a = np.zeros(int(SR * 2.6))
for burst in range(3):
    for k in range(4):
        for f0, dt in [(2100, 0.0), (2600, 0.035)]:
            i = int(SR * (burst * 0.85 + k * 0.12 + dt)); n = int(SR * 0.07); tt = np.arange(n) / SR
            a[i:i + n] += np.sign(np.sin(2 * np.pi * f0 * tt)) * 0.3 * np.minimum(1, (n - np.arange(n)) / 200)
write('alarm.wav', a)

# zombie groan: a low buzzy voice through an "uh-oh" formant, sliding down
n = int(SR * 2.4); t = np.arange(n) / SR
f0 = 110 - 25 * t / 2.4 + 3 * np.sin(2 * np.pi * 5 * t)
saw = 2 * ((np.cumsum(f0) / SR) % 1) - 1
g = bp(saw, 600, 2) + 0.8 * bp(saw, 1000, 3) + 0.3 * bp(saw, 2400, 4)
env = np.minimum(1, t / 0.25) * np.minimum(1, (2.4 - t) / 0.6)
write('groan.wav', g * env, 0.7)

# a bed dragged across the floor: rough scraping with stutters
n = int(SR * 3.0); t = np.arange(n) / SR
scr = bp(rng.standard_normal(n), 900, 1.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t) ** 2) * (np.sin(2 * np.pi * 1.4 * t) > -0.6)
write('drag.wav', scr * np.minimum(1, t / 0.1) * np.minimum(1, (3.0 - t) / 0.2), 0.6)

# brushing: "sot sot" strokes, four per second
n = int(SR * 3.0); t = np.arange(n) / SR
br = bp(rng.standard_normal(n), 5200, 2) * (np.abs(np.sin(2 * np.pi * 2 * t)) ** 3)
write('brush.wav', br, 0.55)

# "bruh": a sad low horn, two notes falling, with a wobble at the end
x = np.zeros(int(SR * 1.9))
for f, at, L in [(155.6, 0.0, 0.45), (116.5, 0.5, 1.3)]:
    n = int(SR * L); tt = np.arange(n) / SR
    ff = f * (1 + (0.03 * np.sin(2 * np.pi * 6 * tt) * (tt > 0.4) if L > 1 else 0))
    saw = 2 * ((np.cumsum(ff) / SR) % 1) - 1
    tone = lp(saw, 0.08) * np.minimum(1, tt / 0.04) * np.minimum(1, (L - tt) / 0.15)
    i = int(at * SR); x[i:i + n] += tone[:len(x) - i]
write('bruh.wav', x, 0.8)
# cereal pouring: a dry rattle of many tiny hits
n = int(SR * 1.6); x = np.zeros(n)
for at in rng.uniform(0, 1.45, 260):
    i = int(at * SR); m = int(SR * 0.012); x[i:i + m] += bp(rng.standard_normal(m), rng.uniform(2500, 5000), 3) * rng.uniform(0.2, 1)
write('pour.wav', x * np.minimum(1, np.arange(n) / 2000), 0.6)

# phone-on-vibrate style buzz for the jittery hands: "brrrrr"
n = int(SR * 2.0); t = np.arange(n) / SR
bz = np.sign(np.sin(2 * np.pi * 120 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * 0.3
write('vibrate.wav', lp(bz, 0.12) * np.minimum(1, t / 0.05) * np.minimum(1, (2.0 - t) / 0.2), 0.6)

# power-down: a whine falling away with a final click
n = int(SR * 1.4); t = np.arange(n) / SR
f = 900 * np.exp(-t * 2.6) + 40
pdn = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5)
pdn[-int(SR * 0.05):] += rng.standard_normal(int(SR * 0.05)) * 0.3 * np.exp(-np.arange(int(SR * 0.05)) / 300)
write('powerdown.wav', pdn, 0.7)

# a soft snore: breathy in (rising) and a buzzy out
n = int(SR * 3.2); t = np.arange(n) / SR
breath = bp(rng.standard_normal(n), 700, 1.2) * (np.sin(np.pi * np.clip(t / 1.4, 0, 1)) * (t < 1.4))
buzz = np.sign(np.sin(2 * np.pi * (38 + 6 * np.sin(2 * np.pi * 3 * t)) * t)) * 0.4
out_ = lp(buzz, 0.05) * (np.sin(np.pi * np.clip((t - 1.6) / 1.4, 0, 1)) * (t > 1.6))
write('snore.wav', breath * 0.6 + out_, 0.5)
print('public/audio:', ', '.join(sorted(os.listdir(A))))
