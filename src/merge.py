import os
from pydub import AudioSegment
import soundfile as sf



def detect_leading_silence(sound, silence_threshold=-50.0, chunk_size=10):
    trim_ms = 0
    assert chunk_size > 0
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold and trim_ms < len(sound):
        trim_ms += chunk_size
    return trim_ms



def merge(folder, sounds):
    merged = None
    for sound in sounds:
        if merged is None:
            merged = sound
        else:
            merged = merged.overlay(sound, position=0)
    print('merged')
    start_trim = detect_leading_silence(merged)
    end_trim = detect_leading_silence(merged.reverse())
    duration = len(merged)
    merged = merged[start_trim:duration-end_trim]
    merged.export(os.path.join(folder, "merged.flac"), format="flac")
    print('done', os.path.join(folder, "merged.flac"))
