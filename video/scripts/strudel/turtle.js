// @title Turtle Overtakes — slow, droopy tuba-ish cue (synth only), scene 5
setcpm(50/4)
stack(
  note("c2 ~ g1 ~ c2 ~ [g1 a1] b1").s("sawtooth").lpf(380).attack(0.04).decay(0.5).sustain(0.5).gain(0.35),
  note("~ e3 ~ e3 ~ e3 ~ d3").s("triangle").decay(0.3).sustain(0).gain(0.08)
)
