import pydub


def extract_silence(name, sound, silence_thresh=-50):
    print(name, 'extracting silence at threshold', silence_thresh)
    ranges = pydub.silence.detect_silence(
        sound[0:60 * 1000], silence_thresh=silence_thresh)

    largest_diff = 0
    largest_range = []
    for r in ranges:
        diff = r[1] - r[0]
        if diff > largest_diff:
            largest_diff = diff
            largest_range = r

    if len(largest_range) < 2:
        return extract_silence(name, sound, silence_thresh + 5)
    return sound[(largest_range[0] + 100):(largest_range[1] - 100)]
