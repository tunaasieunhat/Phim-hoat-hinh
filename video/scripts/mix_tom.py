"""Final audio for the narrated "Tom" video, done with ffmpeg (skills: ffmpeg-filter-complex-patterns, ffmpeg-audio-processing).

Remotion renders picture + narration + effects ("stem"). This script adds the music bed:
  1. music is cut to length, with a one-second silence before every punchline (times from src/Tom/data.ts)
     and a brighter track from the last scene (when rendered);
  2. the music is ducked under the voice with a sidechain compressor keyed by the stem;
  3. stem + music are mixed, peak-limited and normalized in two passes to -14 LUFS / -1.5 dBTP (TikTok, YouTube).
usage: python3 scripts/mix_tom.py out/<stem>.mp4 out/<final>.mp4 [number of scenes in the stem]
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dst = sys.argv[1], sys.argv[2]
s = open(os.path.join(ROOT, 'src', 'Tom', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
upto = int(sys.argv[3]) if len(sys.argv) > 3 else len(scenes)
PUNCH = {(1, 4), (2, 2), (2, 3), (3, 2), (4, 2), (6, 2), (6, 4), (7, 5)}     # same as scripts/kids_narration.py
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
total = starts[upto - 1] + scenes[upto - 1]['frames'] / 30
mutes = [(starts[n - 1] + scenes[n - 1]['sentences'][i]['t0'] - 1.0, starts[n - 1] + scenes[n - 1]['sentences'][i]['t1'] + 0.3) for n, i in sorted(PUNCH) if n <= upto]
gate = '*'.join(f'(1-between(t,{a:.2f},{b:.2f}))' for a, b in mutes) or '1'
A = os.path.join(ROOT, 'public', 'audio')
bright_at = starts[6] if upto >= 7 else None                       # scene 7: the bright track takes over
main_end = bright_at if bright_at else total
fc = [f"[1:a]atrim=0:{main_end:.2f},afade=t=in:d=0.6,afade=t=out:st={main_end - 0.8:.2f}:d=0.8,volume='0.5*{gate}':eval=frame,apad=whole_dur={total:.2f}[m1]"]
inputs = ['-i', src, '-stream_loop', '-1', '-i', os.path.join(A, 'music-quirky.mp3')]
if bright_at:
    inputs += ['-i', os.path.join(A, 'music-bright.mp3')]
    fc += [f"[2:a]atrim=0:{total - bright_at:.2f},afade=t=in:d=0.8,afade=t=out:st={total - bright_at - 2.5:.2f}:d=2.5,volume='0.5*{gate.replace('t,', 't+' + format(bright_at, '.2f') + ',')}':eval=frame,adelay={int(bright_at * 1000)}:all=1[m2]",
           "[m1][m2]amix=inputs=2:normalize=0[m]"]
else:
    fc[0] = fc[0].replace('[m1]', '[m]')
fc += ["[0:a]asplit=2[v][key]",
       "[m][key]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[duck]",   # music steps back under the voice
       "[v][duck]amix=inputs=2:normalize=0,alimiter=limit=0.56:level=false:attack=1:release=50[mix]"]
graph = ';'.join(fc)
LN = 'loudnorm=I=-14:TP=-1.5:LRA=20'
r = subprocess.run(['ffmpeg', '-hide_banner', *inputs, '-filter_complex', f'{graph};[mix]{LN}:print_format=json[o]', '-map', '[o]', '-t', f'{total:.2f}', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(re.findall(r'\{[^{}]+\}', r.stderr)[-1])
meas = f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f'{graph};[mix]{LN}:{meas},aresample=48000[o]', '-map', '0:v', '-map', '[o]',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{total:.2f}', '-movflags', '+faststart', dst], check=True)
print(f"mixed {total:.1f}s, {len(mutes)} punchline mutes; before normalization {m['input_i']} LUFS -> {dst}")
