from pydub import AudioSegment

intro = AudioSegment.from_file('./assets/intro.flac', format='flac')
outro = AudioSegment.from_file('./assets/outro.flac', format='flac')


def edit(sound: AudioSegment):
    print('intro')
    done = intro.overlay(sound, position=(len(intro) - 3000))
    print('middle')
    done = done.append(sound, crossfade=3000)
    print('end')
    done = done.overlay(outro, position=(len(done) - 1500))
    return done.append(outro[1500:len(outro)], crossfade=0)
