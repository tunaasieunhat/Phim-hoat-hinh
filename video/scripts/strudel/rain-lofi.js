// @title Rainy Lo-fi — warm, slow, synth-only cue for the last scene of "Rainy day: plan vs. reality"
setcpm(72/4)
stack(
  note("<[f3,a3,c4,e4] [e3,g3,b3,d4] [d3,f3,a3,c4] [c3,e3,g3,b3]>").s("triangle").attack(0.08).decay(1.6).sustain(0.35).gain(0.14).lpf(1400).room(0.5),
  note("<f2 e2 d2 c2>").s("sine").decay(1.2).sustain(0.4).gain(0.32).lpf(300),
  note("~ a4 ~ c5 ~ e5 ~ c5").s("sine").decay(0.4).sustain(0).gain(0.07).delay(0.3).delaytime(0.375).room(0.4),
  note("c1 ~ ~ c1 ~ ~ c1 ~").s("sine").decay(0.2).sustain(0).gain(0.35).lpf(120),
  note("~ ~ c6 ~ ~ ~ c6 ~").s("triangle").decay(0.03).sustain(0).gain(0.025).hpf(5000)
)
