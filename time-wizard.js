const obj = (time) => {
  time = '' + time
  let match = time.split(':')
  if (match.length === 2) match = ['00'].concat(match)
  if (match.length === 1) match = ['00', '00'].concat(match)
  const hours = parseInt(match[0], 10)
  const minutes = parseInt(match[1], 10)
  const seconds = parseInt(match[2], 10)
  return {
    time,
    match,
    hours,
    minutes,
    seconds,
    total: hours * 60 * 60 + minutes * 60 + seconds
  }
}

const toTime = (seconds) => {
  let remainingMinutesAndSeconds = seconds % (60 * 60)
  let hours = (seconds - remainingMinutesAndSeconds) / (60 * 60)
  if (hours < 10) hours = `0${hours}`
  let remainingSeconds = remainingMinutesAndSeconds % 60
  let remainingMinutes = (remainingMinutesAndSeconds - remainingSeconds) / 60
  if (remainingMinutes < 10) remainingMinutes = `0${remainingMinutes}`
  if (remainingSeconds < 10) remainingSeconds = `0${remainingSeconds}`
  return `${hours}:${remainingMinutes}:${remainingSeconds}`
}

const diff = (left, right) => {
  left = obj(left)
  right = obj(right)
  if (right.total < left.total) throw new Error('the second value should be larger than the first when diffing', left, right)
  return right.total - left.total
}

module.exports = {
  obj, toTime, diff
}
