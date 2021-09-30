import { matcher } from './../src/v1/index';
import Matcher from '../src/core/matcher';

describe('type error', () => {
  test('parameter', () => {
    const data = 'string';
    //@ts-ignore
    expect(() => new Matcher(data)).toThrow();
  });
});

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
    matcher.delete(['b', 'c', Symbol('c')]);
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
    const data = { a: 'a', b: { bb: 'bb' } };
    const matcher = new Matcher(data);
    matcher.editKey({ a: 'a/', b: 'b/' });
    expect(matcher.data).toEqual({ 'a/': 'a', 'b/': { bb: 'bb' } });
  });
  test('clean', () => {
    const data = { price: 100, projectId: undefined };
    const matcher = new Matcher(data);
    matcher.clean([undefined]);
    expect(matcher.data).toEqual({ price: 100 });
  });
  test('clone', () => {
    const data = { a: 'a', b: { bb: 'bb' } };
    const matcher = new Matcher(data);
    matcher.clone({ a: 'a/' });
    expect(matcher.data).toEqual({ a: 'a', 'a/': 'a', b: { bb: 'bb' } });
  });
  test('when', () => {
    const data = { a: 'a', b: { bb: 'bb' } };
    const matcher = new Matcher(data);
    matcher.when(data.a === 'a', (that) => that.add('aa', () => 'aa'), null);
    expect(matcher.data).toEqual({ aa: 'aa', a: 'a', b: { bb: 'bb' } });
    matcher.when(data.a === 'aa', null, (that) => that.add('aa', () => 'aa'));
    expect(matcher.data).toEqual({ aa: 'aa', a: 'a', b: { bb: 'bb' } });
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
    const data = [
      { a: 'a', b: 'b' },
      { a: 'a1', b: 'b1' },
    ];
    const matcher = new Matcher(data);
    matcher.editKey({ a: 'a/' }).editKey({ c: 'c/' });
    expect(matcher.data).toEqual([
      { 'a/': 'a', b: 'b' },
      { 'a/': 'a1', b: 'b1' },
    ]);
  });

  test('valueDelivery', () => {
    const data = [
      { a: 'a', b: 'b' },
      { a: 'a1', b: 'b1' },
    ];
    const matcher = new Matcher(data);
    matcher
      .add('c', () => 'c')
      .delete(['b'])
      .editValue('a', () => 'aa');
    expect(data).toEqual([
      { a: 'a', b: 'b' },
      { a: 'a1', b: 'b1' },
    ]);
    expect(matcher.data).toEqual([
      { a: 'aa', c: 'c' },
      { a: 'aa', c: 'c' },
    ]);
    // 顺序无关
    matcher
      .editValue('a', () => 'aa')
      .add('c', () => 'c')
      .delete(['b']);
    expect(matcher.data).toEqual([
      { a: 'aa', c: 'c' },
      { a: 'aa', c: 'c' },
    ]);
  });
});
