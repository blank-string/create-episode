import subprocess
from scipy.io.wavfile import read
import librosa
import soundfile as sf
import os

filename = os.environ.get('FILENAME')

filename = os.path.abspath(filename)
dir = os.path.dirname(filename)
whole_name = filename.replace(dir + '/', '')
name = os.path.splitext(whole_name)[0]
extension = os.path.splitext(whole_name)[1].replace('.', '')

trimmed = '{}/{}-trimmed.{}'.format(dir, name, extension)

def exec(bashCommand):
    process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    print(output.decode('utf-8'))
    if not error is None:
        print(error)

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
        if tick >= 60:
            return latest_tick + percent
    return latest_tick + percent

time = clap(filename)
exec('sox {} -c 1 {} trim {}'.format(filename, trimmed, time))