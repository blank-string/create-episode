# Create Episode

```sh
sudo apt-get install -y ffmpeg sox
pip install -r requirements
FOLDER=... python main.py
```

## TODO

* make clap quicker by using numpy instead of for loop
    * find max and get that values index would be quicker, might not even need numpy
* is high pass filter worth doing?
* use GitHub and try to make it all in-memory
* replace noise reduction with pure python
* Do the auto stuff async
* Have this running in a container, then deploy that somewhere
* If the files were in GitHub then I could just download them, no reason to be private right?
