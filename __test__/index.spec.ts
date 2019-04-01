const Matcher = require('../lib/index.js')
const matcher = new Matcher()
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

test('part', () => {
  expect(
    matcher
      .input({ test: '1', b: '2' })
      .part('test', () => {
        return 3
      })
      .output(),
  ).toEqual({
    test: 3,
    b: '2',
  })

  expect(
    matcher
      .input({ test: '1', img: ['1', '2', '3'] })
      .part('img', res => {
        return res.map(i => {
          return { src: i }
        })
      })
      .output(),
  ).toEqual({
    test: '1',
    img: [{ src: '1' }, { src: '2' }, { src: '3' }],
  })
})
