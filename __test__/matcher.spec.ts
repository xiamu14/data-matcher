import Matcher from '../src/core/matcher';

describe('matcher object', () => {
  test('deepClone', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    expect(data === matcher.data).toEqual(false);
  });

  test('add', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.add('c', (data) => `c${data.a}`);
    expect(matcher.data).toEqual({ a: 'a', b: 'b', c: 'ca' });
    const uniqC = Symbol('c');
    matcher.add(uniqC, () => 'symbol(c)');
    // console.log(matcher.data);
    expect(matcher.data).toEqual({ a: 'a', b: 'b', [uniqC]: 'symbol(c)' });
  });
  test('delete', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.delete(['b', 'c']);
    expect(matcher.data).toEqual({ a: 'a' });
  });
  test('editValue', () => {
    const data = { a: [{ a: 'a' }], b: 'b' };
    const matcher = new Matcher(data);
    matcher
      .editValue('a', (value) => `${value[0].a}/`)
      .editValue('c', () => 'c');
    expect(matcher.data).toEqual({ a: 'a/', b: 'b' });
    matcher.editValue('a', (item) => {
      return item.map(() => ({ aa: 'aa', ab: { abc: 'abc' } }));
    });
    expect(matcher.data).toEqual({
      a: [{ aa: 'aa', ab: { abc: 'abc' } }],
      b: 'b',
    });
    // 验证不影响原始数据
    expect(data).toEqual({ a: [{ a: 'a' }], b: 'b' });
  });
  test('editKey', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.editKey({ a: 'a/' }).editKey({ c: 'c/' });
    expect(matcher.data).toEqual({ 'a/': 'a', b: 'b' });
  });
  test('valueDelivery', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher
      .add('c', () => 'c')
      .delete(['b'])
      .editValue('a', () => 'aa');
    expect(data).toEqual({ a: 'a', b: 'b' });
    expect(matcher.data).toEqual({ a: 'aa', c: 'c' });
    // 顺序无关
    matcher
      .editValue('a', () => 'aa')
      .add('c', () => 'c')
      .delete(['b']);
    expect(matcher.data).toEqual({ a: 'aa', c: 'c' });
  });
});

describe('matcher object array', () => {
  test('deepClone', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    expect(data === matcher.data).toEqual(false);
  });

  test('add', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher.add('c', () => 'c');
    expect(matcher.data).toEqual([{ a: 'a', b: 'b', c: 'c' }]);
  });
  test('delete', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher.delete(['b']);
    expect(matcher.data).toEqual([{ a: 'a' }]);
  });
  test('editValue', () => {
    const data = [{ a: [{ a: 'a' }], b: 'b' }];
    const matcher = new Matcher(data);
    matcher.editValue('a', () => 'a/');
    expect(matcher.data).toEqual([{ a: 'a/', b: 'b' }]);
    matcher.editValue('a', (item) => {
      return item.map(() => ({ aa: 'aa', ab: { abc: 'abc' } }));
    });
    expect(matcher.data).toEqual([
      {
        a: [{ aa: 'aa', ab: { abc: 'abc' } }],
        b: 'b',
      },
    ]);
    // 验证不影响原始数据
    expect(data).toEqual([{ a: [{ a: 'a' }], b: 'b' }]);
  });
  test('editKey', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher.editKey({ a: 'a/' });
    expect(matcher.data).toEqual([{ 'a/': 'a', b: 'b' }]);
  });
  test('valueDelivery', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher
      .add('c', () => 'c')
      .delete(['b'])
      .editValue('a', () => 'aa');
    expect(data).toEqual([{ a: 'a', b: 'b' }]);
    expect(matcher.data).toEqual([{ a: 'aa', c: 'c' }]);
    // 顺序无关
    matcher
      .editValue('a', () => 'aa')
      .add('c', () => 'c')
      .delete(['b']);
    expect(matcher.data).toEqual([{ a: 'aa', c: 'c' }]);
  });
});
