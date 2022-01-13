import Matcher from '../src/core/matcher';

describe('type error', () => {
  test('string', () => {
    const data = 'string';
    //@ts-ignore
    expect(() => new Matcher(data)).toThrow(
      'The dataSet must be an Object or Array,and cannot be an empty object or empty array.',
    );
  });

  test('empty array', () => {
    const data: any[] = [];
    //@ts-ignore
    expect(() => new Matcher(data)).toThrow(
      'The dataSet must be an Object or Array,and cannot be an empty object or empty array.',
    );
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
    expect(matcher.data).toEqual({ a: 'a', b: 'b', [uniqC]: 'symbol(c)' });
  });

  test('noExit', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    // @ts-ignore
    matcher.delete(['c']);
    expect(matcher.data).toEqual({ a: 'a', b: 'b' });
  });

  test('delete', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.delete(['b']);
    expect(matcher.data).toEqual({ a: 'a' });
    expect(matcher.getOrigin()).toEqual({ a: 'a', b: 'b' });
  });

  test('pick', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.pick(['b']);
    expect(matcher.data).toEqual({ b: 'b' });
  });

  test('pickOrDelete', () => {
    const data = { a: 'a', b: 'b' };
    const matcher = new Matcher(data);
    matcher.pick(['b']).delete(['b', 'a']);
    expect(matcher.data).toEqual({ b: 'b' });
  });

  test('editValue', () => {
    const data = { a: [{ a: 'a' }], b: 'b' };
    const matcher = new Matcher(data);
    matcher
      .editValue('a', (value) => `${value[0].a}/`)
      .editValue('b', () => 'c');
    expect(matcher.data).toEqual({ a: 'a/', b: 'c' });
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
    matcher.add('a', () => 'aa');
    expect(matcher.data).toEqual([{ a: 'a', b: 'b' }]);
  });

  test('delete', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher.delete(['b']);
    expect(matcher.data).toEqual([{ a: 'a' }]);
  });

  test('pick', () => {
    const data = [{ a: 'a', b: 'b' }];
    const matcher = new Matcher(data);
    matcher.pick(['a']);
    expect(matcher.data).toEqual([{ a: 'a' }]);
  });

  test('pickOrDelete', () => {
    const data = [{ a: 'a', b: 'b', c: 'c' }];
    const matcher = new Matcher(data);
    matcher.pick(['b']).delete(['b', 'a']);
    expect(matcher.data).toEqual([{ b: 'b' }]);
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
    expect(matcher.getOrigin()).toEqual([{ a: [{ a: 'a' }], b: 'b' }]);
  });
  test('editKey', () => {
    const data = [
      { a: 'a', b: 'b' },
      { a: 'a1', b: 'b1' },
    ];
    const matcher = new Matcher(data);
    matcher.editKey({ a: 'a/' }).editKey({ b: 'c/' });
    expect(matcher.data).toEqual([
      { 'a/': 'a', 'c/': 'b' },
      { 'a/': 'a1', 'c/': 'b1' },
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

  test('generic', () => {
    const data = [
      { id: 0, nickname: 'a' },
      { id: 1, nickname: 'b' },
    ];
    const matcher = new Matcher<{ id: number; nickname: string }>(data);
    matcher
      .add('c', () => 'c')
      .delete(['nickname'])
      .editValue('id', () => 'id');
    expect(data).toEqual([
      { id: 0, nickname: 'a' },
      { id: 1, nickname: 'b' },
    ]);
    expect(matcher.data).toEqual([
      { id: 'id', c: 'c' },
      { id: 'id', c: 'c' },
    ]);
    // 顺序无关
    matcher
      .editValue('nickname', () => 'aa')
      .add('c', () => 'c')
      .delete(['id']);
    expect(matcher.data).toEqual([
      { c: 'c', nickname: 'aa' },
      { c: 'c', nickname: 'aa' },
    ]);
  });
});
