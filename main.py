import os
from concurrent.futures import ProcessPoolExecutor

from src.auto import auto
from src.edit import edit
from src.merge import merge


def main():
    folder = os.environ['FOLDER']
    folder = os.path.abspath(folder)
    files = os.listdir(folder)
    files = [os.path.join(folder, file) for file in files]
    name = folder.split('/')[-1]
    output = os.path.join(folder, '{}.mp3'.format(name))

    with ProcessPoolExecutor() as executor:
        sounds = executor.map(auto, files)
        sound = merge(folder, sounds)
        done = edit(sound)
        done.export(output, format='mp3')
        print('done', output)

if __name__ == '__main__':
    main()