// @title Coffee Rush — short fun action cue (synth only) for "Not Enough Sleep", scene 7
setcpm(150/4)
stack(
  note("<[c3 c3 c4 c3] [eb3 eb3 eb4 eb3] [f3 f3 f4 f3] [g3 g3 bb3 b3]>").s("sawtooth").lpf(sine.range(600, 2400).slow(4)).decay(0.12).sustain(0).gain(0.28),
  note("<[c5 eb5 g5 c6] [eb5 g5 bb5 eb6] [f5 ab5 c6 f6] [g5 b5 d6 g6]>*2").s("square").decay(0.08).sustain(0).gain(0.07).delay(0.2).delaytime(0.125),
  note("c2*4").s("sine").decay(0.18).sustain(0).gain(0.5).lpf(200),
  note("~ c6 ~ c6").s("triangle").decay(0.03).sustain(0).gain(0.05).hpf(3000)
)
