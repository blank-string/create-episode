import os

from src.auto import auto
from src.merge import merge

folder = os.environ['FOLDER']
folder = os.path.abspath(folder)
files = os.listdir(folder)
files = [os.path.join(folder, file) for file in files]

sounds = [auto(file) for file in files]
merge(folder, sounds)
