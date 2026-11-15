"""Synthesize a gentle 30 s piano + pad background track (original, royalty-free)."""
import sys
import wave
import numpy as np

SR = 44100
DUR = 30.5
BPM = 76
beat = 60 / BPM
t_total = int(SR * DUR)
out = np.zeros((t_total, 2))


def note_freq(n):  # MIDI note -> Hz
    return 440 * 2 ** ((n - 69) / 12)


def piano(freq, length, vel=0.5):
    n = int(SR * length)
    t = np.arange(n) / SR
    env = np.exp(-t * 2.2) * (1 - np.exp(-t * 300))
    tone = sum(np.sin(2 * np.pi * freq * k * t) * a for k, a in [(1, 1), (2, 0.35), (3, 0.12), (4, 0.06)])
    return tone * env * vel


def pad(freq, length, vel=0.08):
    n = int(SR * length)
    t = np.arange(n) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (length - t) / 1.2)
    tone = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 1.003 * t) + 0.3 * np.sin(2 * np.pi * freq * 2.001 * t)
    return tone * env * vel


def add(sig, start, pan=0.0):
    i = int(start * SR)
    j = min(t_total, i + len(sig))
    if i >= t_total:
        return
    s = sig[: j - i]
    out[i:j, 0] += s * (1 - pan) / 2 * 2 ** 0.5
    out[i:j, 1] += s * (1 + pan) / 2 * 2 ** 0.5


# I - V - vi - IV in C major, each chord 2 bars of 4 beats
chords = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
melody = [76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72, 74, 76, 72, 69, 72,
          74, 76, 77, 76, 74, 72, 71, 72]
bar = 4 * beat
t = 0.0
ci = 0
mi = 0
while t < DUR:
    bass, triad = chords[ci % 4]
    span = 2 * bar
    add(pad(note_freq(bass), span + 0.8, 0.07), t)
    for n in triad:
        add(pad(note_freq(n), span + 0.8, 0.035), t, pan=0.2)
    # arpeggio in eighths
    arp = [triad[0], triad[1], triad[2], triad[1] + 12, triad[2], triad[1]]
    for k in range(int(span / (beat / 2))):
        add(piano(note_freq(arp[k % len(arp)]), 1.6, 0.11), t + k * beat / 2, pan=-0.3)
    # melody enters after the first 4 bars, half-note pace
    if t >= 2 * bar:
        for k in range(4):
            add(piano(note_freq(melody[mi % len(melody)]), 2.5, 0.16), t + k * 2 * beat, pan=0.25)
            mi += 1
    t += span
    ci += 1

# simple stereo reverb (feedback delays)
for d, g in [(0.083, 0.35), (0.127, 0.3), (0.191, 0.25), (0.263, 0.2)]:
    k = int(d * SR)
    for _ in range(3):
        out[k:, 0] += out[:-k, 1] * g * 0.5
        out[k:, 1] += out[:-k, 0] * g * 0.5
        g *= 0.5

# fades
fade_in = int(1.0 * SR)
fade_out = int(3.0 * SR)
out[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
out[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
out /= np.max(np.abs(out)) / 0.8

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
