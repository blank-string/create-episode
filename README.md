# Create Episode

This is a command line tool which takes a bunch of meta files and audio files and creates a single clean episode

You will need `sox` installed and all plugins to be able to manipulate and play `wav` (should be default), if you are using `mp3` or any other format you will need those plugins as well.

## Usage

```js
create-episode -d data -n e041
```

this will create a e041.wav file

in your `data` folder

```text
.
├── audio
│   ├── closing.mp3
│   └── opening.mp3
└── eXXX
    ├── eXXX-person-1.wav
    ├── eXXX-person-2.mp3
    ├── person-1.json
    └── person-2.json
```

where `person-1.json` looks like this

```json
{
    "name": "person-1",
    "file": "eXXX-person-1.wav",
    "sync": "2:00",
    "noise": {
        "start": "2:00",
        "end": "2:10"
    },
    "start": "2:15",
    "intro": "intro-file-name.mp3",
    "outro": "outro-file-name.mp3"
}
```

and `person-2.json` look like this

```json
{
    "name": "person-2",
    "file": "eXXX-person-2.wav",
    "sync": "2:00",
    "noise": {
        "start": "2:00",
        "end": "2:10"
    }
}
```

You only need to state the `start`, `intro` and `outro` in one file, you can imagine this person is the editor if that helps and all times become relative to that person.

In order to find these times I would suggest you setup your podcasts using the following steps

1. one person does count down `3 - 2 - 1` and on imaginary `0` clap
2. stay silent for 10 seconds in order to get decent background noise to do noise reduction

It is best to keep your podcast simple `Intro -> Talking -> Outro`

I am still looking for the best way to add SFX (using linux) to the podcast. The current approach which work pretty well. Setup a Ubuntu VM (using virtual box) then have that person join the conference call and they use Pulse Audio in order to record their sounds, this way they are treated like an extra person and you just add that track as if it was a person. If you don't understand this, I have had mixed success with this approach, for whatever reason you are able to hear the audio perfectly in the conference call, but there seems to be a random delay when recording, so editing was required in order to do this.

The other approach I wish to try, but this would require a lot of work, would be to create a JSON object that looks something like this

```js
{
    "name": "person-1",
    "file": "eXXX-person-1.wav",
    "sync": "2:00",
    "noise": {
        "start": "2:00",
        "end": "2:10"
    },
    "start": "2:15",
    "intro": "intro-file-name.mp3",
    "outro": "outro-file-name.mp3",
    "audio": {
        "file": "cheer.mp3",
        "time": "3:45"
    }
}
```

I think an accompanying app would be required in order to generate the JSON and/or the final `mp3` file.


## TODO

* create a docker container with SOX and node to run this script
* create a web page (maybe electron app) to generate json and/or final mp3
* create an application to do all this on GC or some other cloud provider

If anyone is interested in this and wishes to help with a possible kickstarter let me know, I would love to do it, but I don't have time or funds to pay for GC or to take time off work to do this :'(
