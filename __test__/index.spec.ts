import Matcher from '../dist';
import { addKey } from '../lib';

test('addKey', () => {
  const source = { a: 'a' };
  expect(addKey(source, { b: 'b' })).toEqual({ a: 'a', b: 'b' });
});

test('transformKey', () => {
  const matcher = new Matcher({ test: '1' });
  expect(matcher.transformKey({ test: 'tag' }).data).toEqual({
    tag: '1',
  });
});

test('part', () => {
  const matcher = new Matcher({ test: '1', b: '2' });
  expect(
    matcher.part(
      'test',
      () => {
        return 3;
      },
      'c',
    ).data,
  ).toEqual({
    test: '1',
    c: 3,
    b: '2',
  });
});
