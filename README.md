# Create Episode

```sh
sudo apt-get install -y ffmpeg sox
pip install -r requirements
FOLDER=... python main.py
```

## TODO

* Replace as much sox as possible with pydub
* Remove the slience from the ending and remove up to when someone first talks after clap
* Add beginning and ending
* Do the auto stuff async
* Have this running in a container, then deploy that somewhere
* If the files were in GitHub then I could just download them, no reason to be private right?
