"""Final audio for "Rainy day: plan vs. reality" (skills: ffmpeg-filter-complex-patterns, ffmpeg-audio-processing).

Remotion renders picture + voices + effects ("stem"). This script adds, under it:
  - soft rain all the way through;
  - music that follows the story: the upbeat PLAN track, the "deflated" REALITY track after each tear
    (the "wah wah" itself is in the stem), and a warm rainy lo-fi for the last scene;
then ducks rain + music under the voices with a sidechain compressor, limits, and normalizes to -14 LUFS / -1.5 dBTP.
usage: python3 scripts/mix_rain.py out/<stem>.mp4 out/<final>.mp4 [number of scenes in the stem]
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dst = sys.argv[1], sys.argv[2]
s = open(os.path.join(ROOT, 'src', 'Rain', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
upto = int(sys.argv[3]) if len(sys.argv) > 3 else len(scenes)
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
HOLD = 2.0 if upto == len(scenes) else 0.0      # the closing question holds two more seconds (RAIN_HOLD)
total = starts[upto - 1] + scenes[upto - 1]['frames'] / 30 + HOLD
TEAR0, TEAR1 = 5.1, 5.9                     # the PLAN frame rips at 5.1 s and is gone by 5.9 s (scenes 2-5)
A = os.path.join(ROOT, 'public', 'audio')

# music segments (start, end, track); PLAN = upbeat, REALITY = deflated, scene 7 = warm lo-fi
seg = []
for n in range(1, upto + 1):
    a, b = starts[n - 1], starts[n - 1] + scenes[n - 1]['frames'] / 30 + (HOLD if n == upto else 0)
    if n == 1:
        seg.append((a, b, 'plan'))
    elif 2 <= n <= 5:
        seg += [(a, a + TEAR0, 'plan'), (a + TEAR1, b, 'reality')]
    elif n == 6:
        seg.append((a, b, 'reality'))
    else:
        seg.append((a, b, 'lofi'))
# merge neighbours that use the same track, so each track plays on without restarting
merged = []
for a, b, k in seg:
    if merged and merged[-1][2] == k and abs(merged[-1][1] - a) < 0.05:
        merged[-1] = (merged[-1][0], b, k)
    else:
        merged.append((a, b, k))
FILES = {'plan': 'music-plan.mp3', 'reality': 'music-reality.mp3', 'lofi': 'music-rain-lofi.wav'}
GAIN = {'plan': 0.42, 'reality': 0.5, 'lofi': 0.6}
inputs = ['-i', src, '-stream_loop', '-1', '-i', os.path.join(A, 'rain-loop.ogg')]
fc = [f"[1:a]atrim=0:{total:.2f},volume=0.32,afade=t=in:d=1.0,afade=t=out:st={total - 2:.2f}:d=2[rain]"]
labels = ['[rain]']
offs = {'plan': 0.0, 'reality': 0.0, 'lofi': 0.0}
for i, (a, b, k) in enumerate(merged):
    inputs += ['-stream_loop', '-1', '-i', os.path.join(A, FILES[k])]
    L = b - a
    o = offs[k]; offs[k] += L                 # each track continues where it left off
    fc.append(f"[{i + 2}:a]atrim={o:.2f}:{o + L:.2f},asetpts=PTS-STARTPTS,volume={GAIN[k]},afade=t=in:d=0.35,afade=t=out:st={max(0, L - 0.5):.2f}:d=0.5,adelay={int(a * 1000)}:all=1[m{i}]")
    labels.append(f'[m{i}]')
fc.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad=whole_dur={total:.2f}[bed]")
fc += ["[0:a]asplit=2[v][key]",
       "[bed][key]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[duck]",
       "[v][duck]amix=inputs=2:normalize=0,alimiter=limit=0.56:level=false:attack=1:release=50[mix]"]
graph = ';'.join(fc)
LN = 'loudnorm=I=-14:TP=-1.5:LRA=20'
r = subprocess.run(['ffmpeg', '-hide_banner', *inputs, '-filter_complex', f'{graph};[mix]{LN}:print_format=json[o]', '-map', '[o]', '-t', f'{total:.2f}', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(re.findall(r'\{[^{}]+\}', r.stderr)[-1])
meas = f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f'{graph};[mix]{LN}:{meas},aresample=48000[o]', '-map', '0:v', '-map', '[o]',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{total:.2f}', '-movflags', '+faststart', dst], check=True)
print(f"mixed {total:.1f}s: " + ', '.join(f'{k} {a:.1f}-{b:.1f}' for a, b, k in merged) + f" -> {dst}")
