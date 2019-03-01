// sox -m $merged $name-merged.wav
// sox $name-merged.wav $name-mono.wav remix 1
// sox $name-mono.wav $name-mono-norm.wav norm -3 highpass 10
// sox $name-mono-norm.wav $name-mono-norm-start.wav trim $start
// intro_length=`soxi -D $intro_file`
// sox $name-mono-norm-start.wav $name-mono-norm-start-padded.wav pad $intro_length
// sox -m $intro_file $name-mono-norm-start-padded.wav $name-mono-norm-start-padded-intro.wav
// padded_intro_length=`soxi -D $name-mono-norm-start-padded-intro.wav`
// sox $outro_file $outro-padded.wav pad $padded_intro_length
// sox -m $name-mono-norm-start-padded-intro.wav $outro-padded.wav $name.wav
// sox $name.wav $name.mp3 remix 1 norm -3 highpass 10
