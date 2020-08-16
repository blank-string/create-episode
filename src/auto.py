import os
import subprocess

import pydub
from pydub import AudioSegment, effects
from pydub.playback import play


def exec(bashCommand):
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    if not error is None:
        print(error)


def clap(data, samplerate):
    i = 0
    tick = 0
    max = 0
    latest_tick = 0
    percent = 0
    for d in data:
        if i > samplerate:
            i = 0
            tick = tick + 1
        if d > max:
            latest_tick = tick
            max = d
            percent = i / samplerate
        i = i + 1
        if tick >= 10:
            return latest_tick + percent
    return latest_tick + percent


def extract_silence(sound):
    ranges = pydub.silence.detect_silence(
        sound[0:60 * 1000], silence_thresh=-50)

    largest_diff = 0
    largest_range = []
    for r in ranges:
        diff = r[1] - r[0]
        if diff > largest_diff:
            largest_diff = diff
            largest_range = r

    return sound[(largest_range[0] + 100):(largest_range[1] - 100)]


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
    silence = extract_silence(sound)
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
    sound = effects.high_pass_filter(sound, 100)
    print(name, 'high pass filter')

    s = sound[0:10000]
    samples = s.get_array_of_samples()
    time = clap(samples, sound.frame_rate)
    time = round(time * 1000) + 1000
    return sound[time:len(sound)]
