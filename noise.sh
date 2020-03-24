#!/bin/bash

# sox in.ext out.ext trim {start: s.ms} {duration: s.ms}
sox $name.flac $name-noise-clip.flac trim $start $duration

sox $name-noise-clip.flac -n noiseprof $name-noise.prof

# Remove noise from flac using profile
sox $name.flac $name-noise.flac noisered $name-noise.prof 0.25