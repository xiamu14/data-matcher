import Matcher from '../src/core/matcher';

describe('matcher', () => {
  test('deepClone', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    expect(data === matcher.data).toEqual(false);
  });

  test('add', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.add({ key: 'c', valueFn: () => 'c' });
    expect(matcher.data).toEqual({ a: 'a', b: 'b', c: 'c' });
  });
  test('delete', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.delete(['b']);
    expect(matcher.data).toEqual({ a: 'a' });
  });
  test('editValue', () => {
    const data = { a: [{ a: 'a' }], b: 'b' };
    const matcher = new Matcher(data);
    matcher.editValue({ key: 'a', valueFn: () => 'a/' });
    expect(matcher.data).toEqual({ a: 'a/', b: 'b' });
    matcher.editValue({
      key: 'a',
      valueFn: (item) => {
        return item.map(() => ({ aa: 'aa', ab: { abc: 'abc' } }));
      },
    });
    expect(matcher.data).toEqual({
      a: [{ aa: 'aa', ab: { abc: 'abc' } }],
      b: 'b',
    });
  });
  test('editKey', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.editKey([{ key: 'a', newKey: 'a/' }]);
    expect(matcher.data).toEqual({ 'a/': 'a', b: 'b' });
  });
  test('valueDelivery', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher
      .add({ key: 'c', valueFn: () => 'c' })
      .delete(['b'])
      .editValue({ key: 'a', valueFn: () => 'aa' });
    expect(data).toEqual({ a: 'a', b: 'b' });
    expect(matcher.data).toEqual({ a: 'aa', c: 'c' });
    // 顺序无关
    matcher
      .editValue({ key: 'a', valueFn: () => 'aa' })
      .add({ key: 'c', valueFn: () => 'c' })
      .delete(['b']);
    expect(matcher.data).toEqual({ a: 'aa', c: 'c' });
  });
});
