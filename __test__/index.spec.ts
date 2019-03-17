const matcher = require('../lib/index.js')
test('adapter', () => {
  expect(
    matcher
      .input({ test: '1' })
      .transformKey({ test: 'tag' })
      .output(),
  ).toEqual({
    tag: '1',
  })
})
