from pydub import AudioSegment, effects
from pydub.playback import play
import pydub
import subprocess
import os
import soundfile as sf

filename = os.environ.get('FILENAME')

filename = os.path.abspath(filename)
dir = os.path.dirname(filename)
whole_name = filename.replace(dir + '/', '')
name = os.path.splitext(whole_name)[0]
extension = os.path.splitext(whole_name)[1].replace('.', '')

pre_silence = '{}/{}-pre-silence.{}'.format(dir, name, extension)
silence_filename = '{}/{}-silence.{}'.format(dir, name, extension)
profile_filename = '{}/{}.prof'.format(dir, name)
post_silence = '{}/{}-post-silence.{}'.format(dir, name, extension)
post_high_pass = '{}/{}-post-high-pass.{}'.format(dir, name, extension)
post_compand = '{}/{}-post-compand.{}'.format(dir, name, extension)
trimmed = '{}/{}-trimmed.{}'.format(dir, name, extension)
done = '{}/{}-done.{}'.format(dir, name, extension)

def exec(bashCommand):
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    if not error is None:
        print(error)


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

    silence = sound[(largest_range[0] + 100):(largest_range[1] - 100)]
    silence.export(silence_filename, format=extension)

def clap(path):
    data, samplerate = sf.read(path)
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
        if tick >= 15:
            return latest_tick + percent
    return latest_tick + percent

print(filename)
sound = AudioSegment.from_file(filename, format=extension)
print('loaded file')
sound = sound.set_frame_rate(44100)
print('set frame rate')
sound = effects.normalize(sound, 0)
print('normailized')
sound = sound.set_channels(1)
print('single channel')
sound.export(pre_silence, format=extension)
extract_silence(sound)
print('extracted silence')
exec('sox {} -n noiseprof {}'.format(silence_filename, profile_filename))
os.remove(silence_filename)
exec('sox {} {} noisered {} 0.25'.format(pre_silence, post_silence, profile_filename))
print('removed silence')
os.remove(pre_silence)
os.remove(profile_filename)
sound = AudioSegment.from_file(post_silence, format=extension)
os.remove(post_silence)
sound = effects.high_pass_filter(sound, 100)
sound.export(post_high_pass, format=extension)
print('hidh pass filter')
exec('sox {} {} compand 0.05,0.2 6:-54,-90,-36,-36,-24,-24,0,-12 0 -90 0.1'.format(post_high_pass, post_compand))
os.remove(post_high_pass)
time = clap(post_compand)
print('compand')
exec('sox {} -c 1 {} trim {}'.format(post_compand, trimmed, time))
os.remove(post_compand)
print('trimmed start')
os.rename(trimmed, done)
print('done', done)