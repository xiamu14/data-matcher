const Matcher = require('../lib/index.js');
test('transformKey', () => {
  const matcher = new Matcher({ test: '1' });
  expect(matcher.transformKey({ test: 'tag' }).data).toEqual({
    tag: '1',
  });
});

test('part', () => {
  const matcher = new Matcher({ test: '1', b: '2' });
  expect(
    matcher.part('test', () => {
      return 3;
    }).data,
  ).toEqual({
    test: 3,
    b: '2',
  });
});
