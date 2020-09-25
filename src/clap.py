import os
import subprocess

import pydub
from pydub import AudioSegment, effects
from pydub.playback import play
import numpy

clap_max_time = os.environ.get('CLAP_MAX_TIME', 10000)
clap_max_time = int(clap_max_time)


def clap(sound):
    s = sound[0:clap_max_time]
    samples = s.get_array_of_samples()
    max = numpy.max(samples)
    index = samples.index(max)
    time = index / sound.frame_rate
    return round(time * 1000) + 1000
