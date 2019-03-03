# Create Episode

This is a command line tool which takes a bunch of meta files and audio files and creates a single clean episode

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
└── e041
    ├── e041-luke.wav
    ├── e041-matt.mp3
    ├── e041-tim.mp3
    ├── luke.json
    ├── matt.json
    └── tim.json
```

where `luke.json` looks like this

```json
{
    "name": "luke",
    "file": "e041-luke.wav",
    "sync": "5",
    "noise": {
        "start": "2",
        "end": "4.5"
    },
    "end": "36:50",
    "audio": [{
        "file": "opening.mp3",
        "time": "23"
    }, {
        "file": "closing.mp3",
        "time": "23"
    }],
    "start": "23",
    "episode": "e041"
}
```

If you use the podcaster app this json file is created alongside your audio file
The `audio` folder has all your sound effects and clips you wish to use and get merged with your episode in the final cut

## To Do

audio times, start and end to be reduced by sync

cut all to sync and merge

pick shortest start and longest end or start = 0, end = length and trim

change all audio times by this start

pad all audio tracks using their time

merge all audio tracks which do not have insert

then pad the merged one with any inserts

pad any remaining ones

merge remaining tracks

normalize

