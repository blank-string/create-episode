import os
from pydub import AudioSegment
import soundfile as sf


def merge(folder):
    files = os.listdir(folder)
    files = [os.path.join(folder, file) for file in files if 'done' in file]
    sounds = None
    for file in files:
        extension = os.path.splitext(file)[1].replace('.', '')
        sound = AudioSegment.from_file(file, format=extension)
        os.remove(file)
        if sounds is None:
            sounds = sound
        else:
            sounds = sounds.overlay(sound, position=0)
    sounds.export(os.path.join(folder, "merged.flac"), format="flac")
