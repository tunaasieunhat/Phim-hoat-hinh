"""Build project.json for 'POV: a day as a med student' (B1 Minimal Line Art, native 9:16).
Artwork is drawn in code (tools/draw1.mjs, draw2.mjs); English voice = Kokoro af_heart (offline);
Vietnamese semantic single-line subtitles timed to the actual English speech (faster-whisper word times)."""
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = {**json.load(open(f'{ROOT}/art/assets1.json')), **json.load(open(f'{ROOT}/art/assets2.json'))}
from PIL import Image
INK_BOX = {}
for k_, v_ in A.items():
    if isinstance(v_, dict) and 'file' in v_:
        im = Image.open(v_['file']); bb = im.getchannel('A').getbbox(); sc = im.width / v_['w']
        INK_BOX[k_] = [c / sc for c in bb]
LEAD, TAIL = 0.3, 1.0
VOICE_DUR = 53.972
END = round(LEAD + VOICE_DUR + TAIL, 3)
HEAD_X, HEAD_Y, HEAD_SIZE = 96, 300, 96
INK, RED, GREEN, NAVY = '#191916', '#d8392f', '#3f8f4f', '#2c3e63'

def absolute(keys, x, y):
    out = []
    for k in keys:
        k = dict(k)
        if 'dx' in k: k['x'] = round(x + k.pop('dx'), 2)
        if 'dy' in k: k['y'] = round(y + k.pop('dy'), 2)
        out.append(k)
    return out
def img(id, name, x, y, role='prop', reason='', keys=None, w=None, frm=None, to=None, **kw):
    a = A[name]; L = {'type': 'image', 'id': id, 'path': f'art/{name}.png', 'x': x, 'y': y, 'w': w or a['w']}
    if role: L['motion'] = {'role': role, 'reason': reason or f'{id} acts in the scene'}
    if keys: L['keys'] = absolute(keys, x, y)
    if frm is not None: L['from'] = frm
    if to is not None: L['to'] = to
    L.update(kw); return L

def rot(keys, X, Y, px, py, step=0.04):
    """B1 has no pivot property: rotate about (px, py) of the image by moving its origin with the angle.
    keys = [{'t', 'angle'}, ...] (other fields kept); returns dense {'t','angle','x','y'} keys."""
    ks = sorted(keys, key=lambda k: k['t']); out = []
    for a, b in zip(ks, ks[1:] + [None]):
        ts = [a['t']] if b is None else [a['t'] + (b['t'] - a['t']) * i / max(1, round((b['t'] - a['t']) / step)) for i in range(max(1, round((b['t'] - a['t']) / step)))]
        for t in ts:
            th = a['angle'] if b is None else a['angle'] + (b['angle'] - a['angle']) * (t - a['t']) / max(1e-6, b['t'] - a['t'])
            c, s_ = math.cos(th), math.sin(th)
            k = {'t': round(t, 3), 'angle': round(th, 4), 'x': round(X + px - (px * c - py * s_), 2), 'y': round(Y + py - (px * s_ + py * c), 2)}
            for f in ('alpha',):
                if f in a: k[f] = a[f]
            out.append(k)
    return out

def txt(s, x, y, size=72, color=INK, bold=False, w=None, frm=None, to=None, keys=None, id=None):
    L = {'type': 'text', 'text': s, 'x': x, 'y': y, 'size': size, 'color': color}
    if bold: L['bold'] = True
    if w: L['w'] = w
    if frm is not None: L['from'] = frm
    if to is not None: L['to'] = to
    if keys: L['keys'] = absolute(keys, x, y)
    if id: L['id'] = id
    return L
def heading(s, size=HEAD_SIZE, color=INK, w=1020):
    return txt(s, HEAD_X, HEAD_Y, size, color, bold=True, w=w, id=None)
def bob(dur, amp=6, period=1.0, base=0, prop='y', t0=0.0):
    n = max(2, int((dur - t0) / (period / 2)) + 1)
    key = 'd' + prop if prop in ('x', 'y') else prop
    return [{'t': round(t0 + i * period / 2, 3), key: base + (amp if i % 2 else 0)} for i in range(n) if t0 + i * period / 2 <= dur]
def shake(t0, t1, amp, step=0.08, prop='x', base=0):
    ks, i, t = [], 0, t0
    key = 'd' + prop if prop in ('x', 'y') else prop
    while t <= t1: ks.append({'t': round(t, 3), key: base + (amp if i % 2 else -amp)}); t += step; i += 1
    ks.append({'t': round(t1 + step, 3), key: base}); return ks
def pop(t, x, y, dy=40):
    return [{'t': max(0, t - 0.001), 'alpha': 0, 'y': y + dy, 'x': x}, {'t': t + 0.18, 'alpha': 1, 'y': y - 6, 'x': x}, {'t': t + 0.3, 'alpha': 1, 'y': y, 'x': x}]
def region(id, role, ids, x, y, w, h, intent):
    # clamp to the safe stage above the caption band (x 77–1126, y 182–1680 on the 1280-wide plane)
    x0, y0, x1, y1 = max(78, x), max(183, y), min(1125, x + w), min(1679, y + h)
    x, y, w, h = x0, y0, x1 - x0, y1 - y0
    role = role if role in ('actor', 'prop', 'information', 'contact') else 'prop'
    if len(intent.strip()) < 12: intent = f'{intent.strip()} — visible in full at phone size'
    return {'id': id, 'role': role, 'layer_ids': ids, 'region': {'x': x, 'y': y, 'w': w, 'h': h}, 'intent': intent}

# ---- shots (video time = voice time + LEAD)
S = [0, 4.0, 9.75, 17.45, 19.0, 26.4, 31.4, 36.6, 42.2, 46.15, 49.8, END]
shots = []
def shot(i, layers, intent, regions):
    shots.append({'start': S[i], 'end': S[i + 1], 'layers': layers, 'portrait': {'intent': intent, 'background_ids': [], 'regions': regions}})
dur = lambda i: round(S[i + 1] - S[i], 3)

# 1. Five thirty: the alarm chose violence
d = dur(0)
shot(0, [
    heading('5:30 SÁNG'),
    img('s1-window', 'window_night', 800, 420, None),
    img('s1-bed-sleep', 'bed_sleep', 220, 1020, 'actor', 'asleep, then jolted awake by the alarm', to=2.62, keys=bob(2.62, 4, 1.2)),
    img('s1-bed-awake', 'bed_awake', 220, 1020, 'actor', 'jolted upright by the alarm', frm=2.62, keys=[{'t': 2.62, 'y': 990}, {'t': 2.8, 'y': 1020}, {'t': d, 'y': 1014}]),
    img('s1-alarm', 'alarm', 120, 800, 'prop', 'the alarm clock rings and rattles', keys=rot(shake(0.0, 3.6, 0.14, 0.07, 'angle'), 120, 800, 115, 140)),
    txt('RENG RENG!!', 430, 820, 84, RED, bold=True, keys=shake(0.0, 3.6, 6, 0.1, 'x', 0)),
], 'The rattling alarm (left) and the sleeper in bed read below the time heading; the bed fills the lower middle above the caption band.',
   [region('s1-alarm-region', 'prop', ['s1-alarm'], 100, 780, 300, 300, 'The alarm shakes in place.'),
    region('s1-bed-region', 'actor', ['s1-bed-sleep', 's1-bed-awake'], 200, 960, 840, 560, 'The jolt from sleep to sitting upright.')])

# 2. Coffee number one; eyes open, brain loading
d = dur(1); sh = A['coffee_shoulder']; bx, by = 120, 960
arm_keys = [{'t': 0, 'angle': 0.15}, {'t': 0.9, 'angle': 0.15}, {'t': 1.3, 'angle': -0.55}, {'t': 1.9, 'angle': -0.55}, {'t': 2.3, 'angle': 0.15}, {'t': 4.2, 'angle': 0.15}, {'t': 4.6, 'angle': -0.55}, {'t': 5.1, 'angle': -0.55}, {'t': d, 'angle': 0.1}]
shot(1, [
    heading('LY CÀ PHÊ SỐ 1'),
    img('s2-body', 'coffee_body', bx, by, 'actor', 'half-awake, swaying', keys=rot([{'t': round(i * 0.8, 2), 'angle': 0.03 if i % 2 else -0.02} for i in range(int(d / 0.8) + 1)], bx, by, 200, 520)),
    img('s2-arm', 'arm_mug', bx + sh[0] - 40, by + sh[1] - 200, 'prop', 'sips coffee number one', keys=rot(arm_keys, bx + sh[0] - 40, by + sh[1] - 200, 40, 200)),
    txt('Mắt: đã mở', 640, 640, 68, GREEN, bold=True, frm=2.2),
    img('s2-brain', 'brain', 700, 700, 'information', 'the brain: still loading', frm=3.5, keys=pop(3.5, 700, 700) + [{'t': 1.3 + 3.5, 'y': 692}, {'t': d, 'y': 700}]),
    img('s2-bar', 'loadbar_frame', 600, 930, 'information', 'the loading bar frame appears with the brain', frm=3.6),
    img('s2-fill1', 'loadbar_fill1', 618, 938, 'information', 'the brain loads painfully slowly', frm=3.7, to=4.6),
    img('s2-fill2', 'loadbar_fill2', 618, 938, 'information', 'still loading', frm=4.6, to=5.3),
    img('s2-fill3', 'loadbar_fill3', 618, 938, 'information', 'still loading', frm=5.3),
    txt('Não: đang tải… 3%', 640, 1080, 64, INK, frm=3.8),
], 'The sleepy student with the mug on the left; on the right the eye check, then the brain and its slow loading bar build top to bottom.',
   [region('s2-student', 'actor', ['s2-body', 's2-arm'], 100, 900, 520, 640, 'Sway and two sips.'),
    region('s2-brain-region', 'information', ['s2-brain', 's2-bar', 's2-fill1', 's2-fill2', 's2-fill3'], 630, 680, 560, 440, 'The brain appears, the bar crawls.')])

# 3. Ward rounds: doctors stride, the duckling student trails; please don't ask me
d = dur(2); walk = lambda x0, x1: [{'t': 0, 'x': x0}, {'t': d, 'x': x1}]
def walkbob(x0, x1, y):
    ks = []; n = int(d / 0.25)
    for i in range(n + 1): t = i * 0.25; ks.append({'t': round(t, 3), 'x': x0 + (x1 - x0) * t / d, 'y': y - (8 if i % 2 else 0)})
    return ks
shot(2, [
    heading('7:00 · ĐI BUỒNG'),
    {'type': 'line', 'points': [[90, 1640], [1100, 1640]], 'lineWidth': 3, 'color': '#9aa3ab'},
    img('s3-doctor2', 'doctor2', 0, 760, 'actor', 'the senior doctor strides ahead', w=A['doctor2']['w'] * 0.7, keys=walkbob(800, 850, 760)),
    img('s3-doctor1', 'doctor1', 0, 820, 'actor', 'the doctor walks the round with the chart', w=A['doctor1']['w'] * 0.82, keys=walkbob(560, 620, 820)),
    img('s3-student', 'student_note', 0, 900, 'actor', 'the student trails, scribbling every word', w=A['student_note']['w'] * 1.3, keys=walkbob(170, 260, 900)),
    img('s3-duck', 'duck', 0, 1500, 'actor', 'a duckling trails the student like the student trails the doctors', frm=3.95, keys=[{'t': 3.95, 'x': 90, 'y': 1500, 'alpha': 0}] + [{'t': round(4.2 + i * 0.25, 2), 'x': 100 + i * 8, 'y': 1500 - (10 if i % 2 else 0), 'alpha': 1} for i in range(14)]),
    img('s3-thought', 'thought', 120, 560, 'information', 'the silent prayer appears', frm=5.25, keys=pop(5.25, 120, 560)),
    txt('Đừng hỏi em… đừng hỏi em…', 200, 590, 52, INK, w=420, frm=5.35),
], 'A left-to-right procession: student, doctor, senior doctor on one floor line; the prayer bubble above the student, the duckling below.',
   [region('s3-walk', 'actor', ['s3-student', 's3-doctor1', 's3-doctor2'], 160, 940, 1000, 620, 'The round walks right; the student follows.'),
    region('s3-duck-region', 'actor', ['s3-duck'], 0, 1380, 420, 180, 'The duckling waddles in.'),
    region('s3-prayer', 'information', ['s3-thought'], 110, 540, 580, 260, 'The prayer bubble pops.')])

# 4. They ask you
d = dur(3)
shot(3, [
    txt('?!', HEAD_X, 330, 130, RED, bold=True),
    img('s4-doctor', 'ask_doctor', 0, 860, 'actor', 'the doctor turns and points', keys=[{'t': 0, 'x': 40, 'alpha': 0.2}, {'t': 0.18, 'x': 70, 'alpha': 1}, {'t': d, 'x': 80, 'alpha': 1}]),
    img('s4-student', 'ask_student', 640, 820, 'actor', 'the student panics', keys=shake(0.1, d - 0.1, 8, 0.06, 'x')),
    img('s4-drop1', 'drop', 1040, 900, 'prop', 'sweat flies', keys=[{'t': 0.2, 'y': 900, 'alpha': 1}, {'t': d, 'y': 1180, 'alpha': 0.2}]),
    img('s4-drop2', 'drop', 600, 960, 'prop', 'sweat flies', keys=[{'t': 0.4, 'y': 960, 'alpha': 1}, {'t': d, 'y': 1220, 'alpha': 0.2}]),
], 'A two-shot: the pointing doctor from the left, the panicking student filling the right.',
   [region('s4-face-off', 'actor', ['s4-doctor', 's4-student'], 60, 800, 1060, 760, 'The point and the panic.')])

# 5. Anatomy lab: 206 bones; the most relaxed one is the skeleton
d = dur(4)
skx, sky = 800, 900
shot(4, [
    heading('9:00 · PHÒNG GIẢI PHẪU', 88),
    img('s5-student', 'student_books', 90, 900, 'actor', 'the student totters under a tower of anatomy books', w=A['student_books']['w'] * 1.3, keys=rot([{'t': round(i * 0.45, 2), 'angle': (0.035 if i % 2 else -0.035)} for i in range(int(d / 0.45) + 1)], 90, 900, 190 * 1.3, 560 * 1.3)),
    txt('206', 560, 520, 170, RED, bold=True, frm=2.6),
    txt('chiếc xương phải thuộc', 560, 700, 56, INK, frm=2.75),
    img('s5-bone1', 'bone', 560, 770, 'information', 'one bone…', frm=2.85, keys=pop(2.85, 560, 770)),
    img('s5-bone2', 'bone', 690, 770, 'information', '…two bones…', frm=3.05, keys=pop(3.05, 690, 770)),
    img('s5-bone3', 'bone', 820, 770, 'information', '…too many bones', frm=3.25, keys=pop(3.25, 820, 770)),
    img('s5-skeleton', 'skeleton', skx, sky, 'actor', 'the skeleton lounges, perfectly relaxed', keys=rot([{'t': round(i * 0.9, 2), 'angle': (0.03 if i % 2 else -0.01)} for i in range(int(d / 0.9) + 1)], skx, sky, 140, 610)),
    img('s5-glasses', 'sunglasses', skx + 146 - 75, sky + 82 - 30, 'prop', 'sunglasses drop onto the skull: the most relaxed one in the room', frm=5.9, keys=[{'t': 5.9, 'y': sky - 300, 'alpha': 0}, {'t': 6.0, 'alpha': 1}, {'t': 6.3, 'y': sky + 52}, {'t': d, 'y': sky + 52}]),
], 'Left: the student under the book tower; right: the lounging skeleton; the 206 count builds in the middle above them.',
   [region('s5-student-region', 'actor', ['s5-student'], 80, 380, 420, 1180, 'The book tower teeters.'),
    region('s5-count', 'information', ['s5-bone1', 's5-bone2', 's5-bone3'], 550, 760, 420, 110, 'Bones pop in sequence.'),
    region('s5-skeleton-region', 'actor', ['s5-skeleton', 's5-glasses'], 790, 600, 330, 940, 'The skeleton relaxes, sunglasses drop.')])

# 6. Lunch: four minutes; a sandwich standing up, like a horse
d = dur(5); sh = A['lunch_shoulder']; bx, by = 140, 960
chomp = []
for i in range(int(d / 0.5) + 1): chomp += [{'t': round(i * 0.5, 2), 'angle': 0.1}, {'t': round(i * 0.5 + 0.22, 2), 'angle': -0.45}]
shot(5, [
    heading('12:00 · NGHỈ TRƯA', 90),
    txt('4 PHÚT', 640, 560, 80, RED, bold=True),
    img('s6-timer', 'timer', 860, 520, 'information', 'the four-minute timer'),
    img('s6-hand', 'timer_hand', 960, 480, 'information', 'the timer races round', keys=rot([{'t': 0, 'angle': 0}, {'t': d, 'angle': 6.28 * 2}], 960, 480, 10, 150)),
    img('s6-body', 'lunch_body', bx, by, 'actor', 'eats standing up', keys=bob(d, 4, 0.5)),
    img('s6-arm', 'arm_banhmi', bx + sh[0] - 40, by + sh[1] - 200, 'prop', 'shoves the bánh mì in, bite after bite', keys=rot([k for k in chomp if k['t'] <= d], bx + sh[0] - 40, by + sh[1] - 200, 40, 200)),
    img('s6-horse', 'horse', 0, 1020, 'actor', 'a horse joins: same table manners', w=A['horse']['w'] * 0.85, frm=3.7, keys=[{'t': 3.7, 'x': 600, 'alpha': 0}, {'t': 4.1, 'x': 620, 'alpha': 1}, {'t': d, 'x': 630, 'alpha': 1}]),
], 'The eater on the left, the racing timer top right; the horse slides in beside on the same floor.',
   [region('s6-eater', 'actor', ['s6-body', 's6-arm'], 120, 880, 520, 660, 'Bite after bite.'),
    region('s6-timer-region', 'information', ['s6-timer', 's6-hand'], 850, 500, 250, 250, 'The hand spins.'),
    region('s6-horse-region', 'actor', ['s6-horse'], 630, 1040, 480, 450, 'The horse arrives eating.')])

# 7. Skills lab: stitches on a pig's foot; the foot looks better than you
d = dur(6); sh = A['suture_shoulder']; bx, by = 40, 880
stitches = [img(f's7-stitch{i}', 'stitch', 330 + 236 + i * 32, 1100 + 108, 'information', 'one more stitch', frm=round(1.0 + i * 0.32, 2), keys=pop(round(1.0 + i * 0.32, 2), 330 + 236 + i * 32, 1100 + 108, 12)) for i in range(6)]
shot(6, [
    heading('PHÒNG KỸ NĂNG'),
    img('s7-pig', 'pigfoot', 330, 1100, 'prop', 'the pig\'s foot on the practice table'),
    *stitches,
    img('s7-student', 'student_suture', bx, by, 'actor', 'hunched and sweating over the stitches', keys=bob(d, 4, 0.8)),
    img('s7-arm', 'arm_needle', bx + sh[0] - 30, by + sh[1] - 30, 'prop', 'the needle holder shakes', keys=rot(shake(0.2, d - 0.2, 0.06, 0.07, 'angle'), bx + sh[0] - 30, by + sh[1] - 30, 30, 30)),
    img('s7-pigface', 'pigface', 330 + 150, 1100 + 112, 'actor', 'the pig\'s foot smiles: it looks better than you', frm=3.25, keys=pop(3.25, 480, 1212, 10)),
    img('s7-spark1', 'sparkle', 860, 1060, 'prop', 'a sparkle on the neat stitches', frm=3.4, keys=rot([{'t': 3.4, 'alpha': 0, 'angle': 0}, {'t': 3.6, 'alpha': 1, 'angle': 0.6}, {'t': d, 'alpha': 1, 'angle': 1.4}], 860, 1060, 30, 30)),
    img('s7-spark2', 'sparkle', 520, 1040, 'prop', 'a sparkle', frm=3.55, keys=rot([{'t': 3.55, 'alpha': 0, 'angle': 0}, {'t': 3.75, 'alpha': 1, 'angle': -0.6}, {'t': d, 'alpha': 1, 'angle': -1.4}], 520, 1040, 30, 30)),
    txt('Chân giò: 10 điểm', 600, 920, 64, GREEN, bold=True, frm=3.4),
], 'The student leans in from the left; the practice foot fills the right of the table with the stitches building along the cut.',
   [region('s7-student-region', 'actor', ['s7-student', 's7-arm'], 30, 860, 460, 660, 'The shaking hand.'),
    region('s7-foot', 'prop', ['s7-pig', 's7-pigface'] + [f's7-stitch{i}' for i in range(6)], 320, 1080, 660, 380, 'Stitches, then the smug smile.')])

# 8. First patient: her blood pressure, and yours
d = dur(7)
shot(7, [
    heading('16:00 · BỆNH NHÂN ĐẦU TIÊN', 80, w=1040),
    img('s8-patient', 'patient', 80, 960, 'actor', 'the patient waits calmly, smiling', w=A['patient']['w'] * 1.3, keys=bob(d, 3, 1.4)),
    img('s8-student', 'student_bp', 620, 980, 'actor', 'the student squeezes the bulb, nervous', keys=bob(4.2, 4, 0.4) + shake(4.3, d - 0.1, 7, 0.06, 'x')),
    img('s8-gauge1', 'gauge', 150, 600, 'information', 'her gauge'),
    img('s8-needle1', 'gauge_needle', 150 + 120 - 10, 600 + 120 - 170, 'information', 'her pressure settles at normal', keys=rot([{'t': 0, 'angle': -2.3}, {'t': 0.4, 'angle': -2.3}, {'t': 1.6, 'angle': -0.5}, {'t': 2.2, 'angle': -0.42}, {'t': d, 'angle': -0.47}], 260, 550, 10, 170)),
    txt('120/80', 165, 900, 64, GREEN, bold=True, frm=2.1),
    img('s8-gauge2', 'gauge', 760, 560, 'information', 'your gauge pops up', frm=4.2, keys=pop(4.2, 760, 560)),
    img('s8-needle2', 'gauge_needle', 760 + 120 - 10, 560 + 120 - 170, 'information', 'your pressure shoots into the red', frm=4.25, keys=rot([{'t': 4.25, 'angle': -2.3}, {'t': 4.7, 'angle': 2.2}, {'t': 4.8, 'angle': 2.0}, {'t': d, 'angle': 2.15}], 870, 510, 10, 170)),
    txt('180/120!!', 740, 870, 72, RED, bold=True, frm=4.7),
], 'Patient left and student right, each with a gauge above: hers settles at normal first, his shoots into the red after.',
   [region('s8-patient-region', 'actor', ['s8-patient', 's8-gauge1', 's8-needle1'], 70, 580, 480, 960, 'Her calm reading.'),
    region('s8-student-region', 'actor', ['s8-student', 's8-gauge2', 's8-needle2'], 610, 540, 500, 1000, 'His panic reading.')])

# 9. Library: 300 flashcards; three done
d = dur(8)
cards = [img(f's9-card{i}', 'card', 110 + (8 if i % 2 else -6), 1330 - i * 34, 'information', 'the flashcard tower grows', frm=round(1.4 + i * 0.07, 2), keys=pop(round(1.4 + i * 0.07, 2), 110 + (8 if i % 2 else -6), 1330 - i * 34, 20)) for i in range(16)]
done = [img(f's9-done{i}', 'card', 0, 0, 'information', 'one card finished', frm=round(2.8 + i * 0.25, 2), keys=[{'t': round(2.8 + i * 0.25, 2), 'x': 110, 'y': 1330 - 15 * 34, 'angle': 0}, {'t': round(3.15 + i * 0.25, 2), 'x': 900, 'y': 1270 - i * 14, 'angle': 0.2}, {'t': d, 'x': 900, 'y': 1270 - i * 14, 'angle': 0.2}]) for i in range(3)]
shot(8, [
    heading('19:00 · THƯ VIỆN'),
    img('s9-desk', 'lib_desk', 330, 900, 'actor', 'studying at the library desk', w=A['lib_desk']['w'] * 1.2, keys=bob(d, 3, 1.1)),
    txt('300', 110, 640, 150, RED, bold=True, frm=1.5),
    *cards, *done,
    txt('Xong: 3', 860, 1180, 64, GREEN, bold=True, frm=3.4),
], 'The card tower rises on the left; the student studies at the desk on the right; three cards fly to the done pile.',
   [region('s9-tower', 'information', [f's9-card{i}' for i in range(16)], 90, 780, 200, 660, 'The tower builds.'),
    region('s9-study', 'actor', ['s9-desk'] + [f's9-done{i}' for i in range(3)], 370, 1000, 760, 560, 'Three cards done.')])

# 10. Midnight: just one more chapter (a lie: the nose grows)
d = dur(9); nx, ny = A['nose_at']
shot(9, [
    heading('00:00'),
    img('s10-moon', 'moon', 960, 280, 'prop', 'the moon is up', keys=bob(d, 6, 1.6)),
    img('s10-lamp', 'lamp', 130, 900, 'prop', 'the desk lamp flickers', keys=[{'t': 0, 'alpha': 1}, {'t': 1.2, 'alpha': 0.85}, {'t': 1.3, 'alpha': 1}, {'t': d, 'alpha': 1}]),
    img('s10-desk', 'mid_desk', 420, 1000, 'actor', 'slumped over chapter 12', keys=bob(d, 4, 1.2)),
    txt('"Thêm 1 chương nữa thôi…"', 110, 640, 66, INK, w=1000, frm=0.6),
    *[img(f's10-nose{i}', f'nose{i}', 420 + nx - A[f'nose{i}']['w'] + 6, 1000 + ny - 15, 'prop', 'the lie grows the nose longer', frm=round(2.25 + (i - 1) * 0.2, 2), to=(round(2.25 + i * 0.2, 2) if i < 4 else None)) for i in range(1, 5)],
], 'The slumped student at the lamp-lit desk under the moon; the quoted lie above; the nose grows from his face.',
   [region('s10-study', 'actor', ['s10-desk', 's10-nose1', 's10-nose2', 's10-nose3', 's10-nose4', 's10-lamp'], 120, 880, 900, 680, 'Slump, then the growing nose.')])

# 11. Five thirty again; you'd still choose this
d = dur(10)
shot(10, [
    heading('5:30 SÁNG'),
    img('s11-window', 'window_night', 800, 420, None),
    img('s11-alarm', 'alarm', 120, 800, 'prop', 'the alarm rings again', keys=rot([{'t': 0, 'angle': 0}] + shake(0.7, 2.0, 0.14, 0.07, 'angle'), 120, 800, 115, 140)),
    img('s11-bed-sleep', 'bed_sleep', 220, 1020, 'actor', 'asleep again', to=1.9, keys=bob(1.9, 4, 1.0)),
    img('s11-bed-smile', 'bed_smile', 220, 1020, 'actor', 'sits up smiling this time: would choose it again', frm=1.9, keys=[{'t': 1.9, 'y': 1000}, {'t': 2.1, 'y': 1020}] + [{'t': k['t'], 'y': 1020 + k['dy']} for k in bob(d, 4, 0.9, 0, 'y', 2.4)]),
    *[img(f's11-heart{i}', 'heart_big' if i % 2 else 'heart', 640, 660, 'information', 'the heart beats: still choosing medicine', frm=round(2.95 + i * 0.3, 2), to=round(2.95 + (i + 1) * 0.3, 2) if 2.95 + (i + 1) * 0.3 < d else None) for i in range(int((d - 2.95) / 0.3) + 1)],
    txt('Còn bạn?', 110, 560, 110, RED, bold=True, frm=3.85),
], 'A callback to the opening frame: same alarm, same bed; this time a smile, a beating heart and the question.',
   [region('s11-alarm-region', 'prop', ['s11-alarm'], 100, 780, 300, 300, 'The alarm rings again.'),
    region('s11-bed-region', 'actor', ['s11-bed-sleep', 's11-bed-smile'], 200, 960, 840, 560, 'Sits up smiling.'),
    region('s11-heart-region', 'information', [f's11-heart{i}' for i in range(int((dur(10) - 2.95) / 0.3) + 1)], 620, 640, 260, 230, 'The heart beats.')])

# ---- captions: Vietnamese semantic cues on the actual English speech (word times + LEAD)
CUES = [
    (0.00, 1.70, 'POV: bạn chọn ngành Y.'), (1.78, 3.50, 'Còn báo thức thì chọn bạo lực.'),
    (4.26, 6.02, '5 giờ 30. Ly cà phê số một.'), (6.10, 7.30, 'Mắt đã mở…'), (7.38, 9.10, '…não vẫn đang tải.'),
    (9.68, 12.10, '7 giờ sáng, đi buồng.'), (12.18, 13.38, 'Lẽo đẽo theo các bác sĩ'), (13.40, 14.66, 'như vịt con cầm sổ,'),
    (14.72, 15.96, 'chỉ cầu một điều:'), (16.02, 17.26, 'đừng hỏi em.'), (17.34, 18.70, '…Và họ hỏi bạn.'),
    (18.86, 21.26, '9 giờ. Phòng giải phẫu.'), (21.34, 23.16, '206 chiếc xương phải thuộc,'), (23.22, 24.90, 'và người thư thái nhất phòng'), (24.96, 26.30, '…là bộ xương.'),
    (26.42, 28.30, 'Trưa. Nghỉ ăn: bốn phút.'), (28.36, 29.84, 'Đứng ăn ổ bánh mì'), (29.90, 31.50, 'như một chú ngựa.'),
    (31.58, 32.26, 'Phòng kỹ năng.'), (32.30, 34.28, 'Tập khâu trên chân giò.'), (34.34, 36.40, 'Chân giò trông còn ổn hơn bạn.'),
    (36.50, 37.42, '4 giờ chiều.'), (37.48, 39.00, 'Bệnh nhân thật đầu tiên.'), (39.06, 40.52, 'Bạn đo huyết áp cho cô ấy.'), (40.58, 41.96, 'Huyết áp bạn còn cao hơn.'),
    (42.08, 43.38, 'Buổi tối. Thư viện.'), (43.44, 44.62, '300 flashcard.'), (44.68, 45.90, 'Bạn đã xong… ba cái.'),
    (45.98, 46.76, 'Nửa đêm.'), (46.82, 47.98, '"Thêm một chương nữa thôi,"'), (48.04, 49.44, 'bạn tự lừa mình.'),
    (49.52, 51.30, '5 giờ 30. Chuông lại reo.'), (51.36, 52.10, 'Nói thật nhé?'), (52.16, 53.34, 'Bạn vẫn sẽ chọn ngành này.'), (53.40, 54.50, 'Còn bạn thì sao?'),
]
captions = [{'start': round(a + LEAD, 3), 'end': round(b + LEAD, 3), 'text': t} for a, b, t in CUES]

# ---- sound: restrained action SFX on visible contacts; one licensed cartoon bed under the voice
AU = 'audio2/audio/'
def sfx(path, time, gain, **kw): return {'kind': 'file', 'path': AU + path, 'time': round(time, 3), 'gain': gain, **kw}
sfxl = [
    sfx('kenney-impact/impactBell_heavy_000.ogg', 0.05, 0.22),
    {'kind': 'jingle', 'time': 0.5, 'gain': 0.05}, {'kind': 'jingle', 'time': 1.4, 'gain': 0.05},
    sfx('aeva-boing/boing.flac', 2.62, 0.3, duration=0.9, fadeOut=0.2),
    sfx('owlish-home-202/Drink/Drink_01.wav', S[1] + 1.3, 0.35),
    {'kind': 'pop', 'time': S[1] + 3.5, 'gain': 0.03},
    sfx('rubberduck-general-100-2/sfx100v2_footstep_01.ogg', S[2] + 0.25, 0.12), sfx('rubberduck-general-100-2/sfx100v2_footstep_02.ogg', S[2] + 0.75, 0.12),
    sfx('bart-squeak-toys/squeak toy/squeak toy - squeak1.wav', S[2] + 4.2, 0.18),
    {'kind': 'pop', 'time': S[2] + 5.25, 'gain': 0.03},
    sfx('record-scratch/160909__raccoonanimator__scratch-speed.wav', S[3] + 0.02, 0.3),
    {'kind': 'pop', 'time': S[4] + 2.85, 'gain': 0.025}, {'kind': 'pop', 'time': S[4] + 3.05, 'gain': 0.025}, {'kind': 'pop', 'time': S[4] + 3.25, 'gain': 0.025},
    sfx('kevin-rimshot/bah-dum.wav', S[4] + 6.3, 0.25, duration=1.4, fadeOut=0.3),
    sfx('joedeshon-slide-whistle/79671__joedeshon__slide-whistle-down-01.wav', S[5] + 3.7, 0.18),
    *[{'kind': 'tap', 'time': round(S[6] + 1.0 + i * 0.32, 3), 'gain': 0.03} for i in range(6)],
    {'kind': 'chime', 'time': S[6] + 3.4, 'gain': 0.04},
    {'kind': 'pop', 'time': S[7] + 2.1, 'gain': 0.025},
    sfx('ez-boings/bing_01_0.mp3', S[7] + 4.7, 0.25),
    sfx('kenney-rpg/bookFlip1.ogg', S[8] + 1.4, 0.2), sfx('owlish-home-202/Paper & Stationery/Stationery_01.wav', S[8] + 2.8, 0.2),
    sfx('bart-squeak-toys/squeak toy/squeak toy - squeak3.wav', S[9] + 2.3, 0.18),
    sfx('kenney-impact/impactBell_heavy_000.ogg', S[10] + 0.7, 0.18),
    {'kind': 'chime', 'time': S[10] + 2.95, 'gain': 0.05},
]

# every important layer belongs to a native portrait region: gather uncovered text into a text region; floor lines are background
from PIL import ImageFont
_fonts = {}
TEXT_INK = json.load(open(f'{ROOT}/art/text-ink.json')) if os.path.exists(f'{ROOT}/art/text-ink.json') else {}
def text_bbox(L):
    ink = TEXT_INK.get(L.get('id'))
    if ink: return ink[0] - 8, ink[1] - 8, ink[2] + 8, ink[3] + 8
    size = L['size']; f = _fonts.setdefault(size, ImageFont.truetype(f'{ROOT}/fonts/PatrickHand-Regular.ttf', size))
    maxw = L.get('w') or (1080 - L['x']); words = L['text'].split(' '); lines, cur = [], ''
    for w_ in words:
        t_ = (cur + ' ' + w_).strip()
        if f.getlength(t_) * 1.04 > maxw and cur: lines.append(cur); cur = w_
        else: cur = t_
    lines.append(cur)
    width = max(f.getlength(l_) for l_ in lines) * 1.06 + 6      # bold is synthesised a little wider
    dx = [k.get('x', L['x']) - L['x'] for k in L.get('keys', [])] or [0]
    top = L['y'] - 8; bottom = L['y'] + len(lines) * size * 1.2 + 8
    return L['x'] + min(dx) - 10, top, L['x'] + max(dx) + width * 1.05 + 12, bottom
def cover_text(si, sh_):
    covered = {i for r in sh_['portrait']['regions'] for i in r['layer_ids']}
    for L in sh_['layers']:
        if L['type'] == 'image' and L['id'] not in covered:
            if not L.get('motion') and not L.get('keys'): sh_['portrait']['background_ids'].append(L['id'])
            else:
                a = A[L['path'][4:-4]]; sh_['portrait']['regions'].append(region(L['id'] + '-region', L.get('motion', {}).get('role', 'prop'), [L['id']], max(0, L['x']), max(0, L['y']), a['w'], a['h'], L.get('motion', {}).get('reason', '')))
    T = [L for L in sh_['layers'] if L['type'] == 'text' and L['id'] not in covered]
    for L in sh_['layers']:
        if L['type'] == 'line': sh_['portrait']['background_ids'].append(L['id'])
    if T:
        bbs = [text_bbox(L) for L in T]; x0, y0, x1, y1 = min(b[0] for b in bbs), min(b[1] for b in bbs), max(b[2] for b in bbs), max(b[3] for b in bbs)
        if x0 < 77 or y0 < 182 or x1 > 1126 or y1 > 1680: print('TEXT OUTSIDE SAFE', si + 1, [round(v) for v in (x0, y0, x1, y1)], [L['text'] for L in T])
        sh_['portrait']['regions'].append(region(f's{si + 1}-text', 'information', [L['id'] for L in T], x0, y0, x1 - x0, y1 - y0, 'The handwritten heading and labels read in order, inside the safe area.'))
# keys must be strictly increasing and inside the shot (validator)
for si, sh_ in enumerate(shots):
    span = round(sh_['end'] - sh_['start'], 3)
    for li, L in enumerate(sh_['layers']):
        if not L.get('id'): L['id'] = f's{si + 1}-{L["type"]}{li}'
        if 'to' in L and L['to'] is None: del L['to']
        if L.get('to') is not None and L['to'] > span - 0.002: L['to'] = round(span - 0.002, 3)
        if 'keys' in L:
            ks = {}
            for k in sorted(L['keys'], key=lambda k: k['t']):
                if 0 <= k['t'] <= span - 0.002: ks[round(k['t'], 3)] = {**k, 't': round(k['t'], 3)}
            L['keys'] = list(ks.values())
            if not L['keys']: del L['keys']

def layer_bbox(L):
    if L['type'] != 'image': return None
    n = L['path'][4:-4]; a = A[n]; k_ = L.get('w', a['w']) / a['w']; bx0, by0, bx1, by1 = [v * k_ for v in INK_BOX[n]]
    keys = L.get('keys', [])
    states = ([{'x': L['x'], 'y': L['y'], 'angle': 0}] if not any('x' in k or 'y' in k for k in keys) else []) + [{'x': k.get('x', L['x']), 'y': k.get('y', L['y']), 'angle': k.get('angle', 0)} for k in keys]
    xs, ys = [], []
    for st in states:
        c, s_ = math.cos(st['angle']), math.sin(st['angle'])
        for cx, cy in ((bx0, by0), (bx1, by0), (bx0, by1), (bx1, by1)): xs.append(st['x'] + cx * c - cy * s_); ys.append(st['y'] + cx * s_ + cy * c)
    return min(xs), min(ys), max(xs), max(ys)
def fit_regions(sh_):
    byid = {L['id']: L for L in sh_['layers']}
    for r in sh_['portrait']['regions']:
        bbs = [layer_bbox(byid[i]) if byid[i]['type'] == 'image' else text_bbox(byid[i]) for i in r['layer_ids'] if i in byid and byid[i]['type'] in ('image', 'text')]
        if not bbs: continue
        x0, y0 = min(b[0] for b in bbs) - 6, min(b[1] for b in bbs) - 6; x1, y1 = max(b[2] for b in bbs) + 6, max(b[3] for b in bbs) + 6
        if x0 < 77 or y0 < 182 or x1 > 1126 or y1 > 1680: print('OUTSIDE SAFE', r['id'], [round(v) for v in (x0, y0, x1, y1)])
        r['region'] = {'x': round(max(78, x0), 1), 'y': round(max(183, y0), 1), 'w': round(min(1125, x1) - max(78, x0), 1), 'h': round(min(1679, y1) - max(183, y0), 1)}
def est_text(L):
    size = L['size']; f = _fonts.setdefault(size, ImageFont.truetype(f'{ROOT}/fonts/PatrickHand-Regular.ttf', size))
    maxw = L.get('w') or (1080 - L['x']); words = L['text'].split(' '); lines, cur = [], ''
    for w_ in words:
        t_ = (cur + ' ' + w_).strip()
        if f.getlength(t_) * 1.04 > maxw and cur: lines.append(cur); cur = w_
        else: cur = t_
    lines.append(cur)
    return L['x'], L['y'], L['x'] + max(f.getlength(l_) for l_ in lines) * 1.1, L['y'] + len(lines) * size * 1.18
SCENE_SCALE = []
def autofit(sh_, top=430, bottom=1650, left=90, right=1110, kmax=1.75):
    body = sh_['layers'][1:]
    bbs = [layer_bbox(L) if L['type'] == 'image' else est_text(L) for L in body if L['type'] in ('image', 'text')]
    x0, y0, x1, y1 = min(b[0] for b in bbs), min(b[1] for b in bbs), max(b[2] for b in bbs), max(b[3] for b in bbs)
    K = min(kmax, (right - left) / (x1 - x0), (bottom - top) / (y1 - y0))
    ax, ay = (x0 + x1) / 2, y1; tx, ty = (left + right) / 2, bottom
    T = lambda X, Y: (round(tx + (X - ax) * K, 2), round(ty + (Y - ay) * K, 2))
    for L in body:
        if L['type'] in ('image', 'text'):
            L['x'], L['y'] = T(L['x'], L['y'])
            if 'w' in L: L['w'] = round(L['w'] * K, 2)
            if L['type'] == 'text': L['size'] = round(L['size'] * K, 1)
            for k in L.get('keys', []):
                if 'x' in k or 'y' in k:
                    X, Y = T(k.get('x', 0), k.get('y', 0))
                    if 'x' in k: k['x'] = X
                    if 'y' in k: k['y'] = Y
        elif L['type'] == 'line': L['points'] = [list(T(*pt)) for pt in L['points']]
    SCENE_SCALE.append(round(K, 3))
for si, sh_ in enumerate(shots):
    for li, L in enumerate(sh_['layers']):
        if not L.get('id'): L['id'] = f's{si + 1}-{L["type"]}{li}'
    autofit(sh_)
for si, sh_ in enumerate(shots): cover_text(si, sh_); fit_regions(sh_)

project = {
    'version': 1, 'style': 'B1', 'width': 1080, 'height': 1920, 'fps': 30,
    'font': 'fonts/PatrickHand-Regular.ttf',
    'voice': {'path': 'narration.wav', 'lead': LEAD, 'tail': TAIL},
    'music': {'path': AU + 'music/bgm-fluffing-a-duck.mp3', 'gain': 0.07},
    'captions': captions, 'shots': shots, 'sfx': sfxl,
    'ambience': [{'path': AU + 'the-shop/TheShopCollection_convenience_store_drinks_fridge_drone.wav', 'start': 0, 'end': END, 'gain': 0.03, 'loop': True, 'fadeIn': 0.5, 'fadeOut': 1.0}],
    'portrait': {'safe_area': {'left': 0.06, 'right': 0.12, 'top': 0.08, 'bottom': 0.18}},
    'reference_review': {'author_id': 'claude-code-session', 'capability': {'mode': 'limited', 'environment': 'Claude Code cloud session, no paid image/TTS service; artwork drawn procedurally in code, Kokoro offline TTS',
        'limitations': ['No image-generation tool: all stick figures and props are drawn procedurally by code, not generated to match the Ryan V4 artwork', 'The reviewer cannot listen to audio; sound is checked by measurement only', 'Narration is Kokoro af_heart (offline), not the sample Gemini voice; Vietnamese subtitles under English speech']}},
}
json.dump(project, open(f'{ROOT}/project.json', 'w'), ensure_ascii=False, indent=1)
print('shots', len(shots), 'captions', len(captions), 'sfx', len(sfxl), 'end', END)
