import os

from src.auto import auto
from src.merge import merge
from src.edit import edit

folder = os.environ['FOLDER']
folder = os.path.abspath(folder)
files = os.listdir(folder)
files = [os.path.join(folder, file) for file in files]
name = folder.split('/')[-1]

sounds = [auto(file) for file in files]
sound = merge(folder, sounds)
done = edit(sound)
done.export(os.path.join(folder, '{}.mp3'.format(name)), format='mp3')