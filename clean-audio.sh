#!/bin/bash

filename=$(basename -- "$file")
dir=$(dirname "$file")
extension="${filename##*.}"
name="$dir/${filename%.*}"

echo BASE

# 44100 16
sox -G $name.$extension -b 16 $name-base.$extension rate 44100 dither -s

echo NORM

#normalize
sox $name-base.$extension --norm=1 $name-base-norm.$extension

echo MONO

#mono
sox $name-base-norm.$extension $name-base-norm-mono.$extension remix 1,2

echo NOISE

# sox in.ext out.ext trim {start: s.ms} {duration: s.ms}
sox $name-base-norm-mono.$extension $name-base-norm-mono-noise-clip.$extension trim $start $duration
sox $name-base-norm-mono-noise-clip.$extension -n noiseprof $name-base-norm-mono-noise.prof
sox $name-base-norm-mono.$extension $name-base-norm-mono-noise.$extension noisered $name-base-norm-mono-noise.prof 0.25

echo CLEAN

# cleanup
sox $name-base-norm-mono-noise.$extension $name-base-norm-mono-noise-clean.$extension \
    highpass 100 \
    compand 0.05,0.2 6:-54,-90,-36,-36,-24,-24,0,-12 0 -90 0.1

echo DONE

# remove silence
# sox $name-base-norm-mono-clean.$extension $name-base-norm-mono-clean-sil.$extension silence -l 1 0.1 1% -1 2.0 1%