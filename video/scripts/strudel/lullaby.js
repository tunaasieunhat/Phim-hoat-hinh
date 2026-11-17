// @title Dream Lullaby — music-box cue (synth only), scene 6 dream bubble
setcpm(70/4)
stack(
  note("e5 g5 c6 g5 e5 g5 d6 g5").s("triangle").decay(0.6).sustain(0).gain(0.16).room(0.6).delay(0.3).delaytime(0.375),
  note("<c4,e4,g4 g3,b3,d4>").s("sine").attack(0.4).decay(1.5).sustain(0.4).gain(0.08).room(0.5)
)
