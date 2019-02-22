name=$1
in=$name.mp3
out=$name.wav
noise_start=$2
noise_end=$3
clap=$4
end=$5

echo noise $in
sox $in noise-$name.wav trim $noise_start $noise_end
sox noise-$name.wav -n noiseprof $name-noise.prof

echo editing $in
sox $in $out noisered $name-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10

echo finished $out

sox $name.wav $name-end.wav trim 0 $end
sox $name-end.wav $name-clipped.wav trim $clap
