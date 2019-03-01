const timeWizard = require('./time-wizard')

test('obj', () => {
  const output = timeWizard.obj('123:45:67')
  expect(output).toEqual({
    time: '123:45:67',
    match: [ '123', '45', '67' ],
    hours: 123,
    minutes: 45,
    seconds: 67,
    total: 445567
  })
})

test('toTime', () => {
  const output = timeWizard.toTime(445567)
  expect(output).toBe('123:46:07')
})

test('diff', () => {
  const output = timeWizard.diff('1:01:01', '2:03:04')
  expect(output).toEqual(3723)
})
