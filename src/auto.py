import os
import subprocess

import pydub
from pydub import AudioSegment, effects
from pydub.playback import play

from src.clap import clap
from src.extract_silence import extract_silence


def exec(bashCommand):
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    if not error is None:
        print(error)


def auto(filename) -> AudioSegment:
    dir = os.path.dirname(filename)
    whole_name = filename.replace(dir + '/', '')
    name = os.path.splitext(whole_name)[0]
    extension = os.path.splitext(whole_name)[1].replace('.', '')

    pre_silence = '{}/{}-pre-silence.{}'.format(dir, name, extension)
    silence_filename = '{}/{}-silence.{}'.format(dir, name, extension)
    profile_filename = '{}/{}.prof'.format(dir, name)
    post_silence = '{}/{}-post-silence.{}'.format(dir, name, extension)

    print(name)
    sound = AudioSegment.from_file(filename, format=extension)
    print(name, 'loaded file')

    sound = sound.set_frame_rate(44100)
    print(name, 'set frame rate')

    sound = effects.normalize(sound, 0)
    print(name, 'normailized')

    sound = sound.set_channels(1)
    print(name, 'single channel')

    sound.export(pre_silence, format=extension)
    silence = extract_silence(name, sound)
    silence.export(silence_filename, format=extension)
    print(name, 'extracted silence')
    exec('sox {} -n noiseprof {}'.format(silence_filename, profile_filename))
    os.remove(silence_filename)
    exec('sox {} {} noisered {} 0.25'.format(
        pre_silence, post_silence, profile_filename))
    print(name, 'removed silence')

    os.remove(pre_silence)
    os.remove(profile_filename)
    sound = AudioSegment.from_file(post_silence, format=extension)
    os.remove(post_silence)

    time = clap(sound)
    print(name, 'sync at', time)
    return sound[time:len(sound)]
