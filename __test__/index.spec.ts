const Adapter = require('../lib/index.js')
const adapter = Adapter
test('adapter', () => {
  expect(
    adapter
      .input({ test: '1' })
      .transformKey({ test: 'tag' })
      .output(),
  ).toEqual({
    tag: '1',
  })
})
