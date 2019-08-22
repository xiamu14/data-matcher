import Matcher, {
  toValuesArray,
  transformKey,
  transformValueType,
  transformEmpty,
  addKey,
  part,
  addKeyFn,
  remove,
} from '../dist';

// ------------ toValuesArray -------------
describe('toValuesArray', () => {
  test('object', () => {
    const data = { a: 'a', b: 'b' };
    expect(toValuesArray(data)).toEqual(['a', 'b']);
  });
  test('objectArray', () => {
    const data = [{ a: 'a', b: 'b' }];
    expect(toValuesArray(data)).toEqual([['a', 'b']]);
  });
});

// ------------ addKey -------------
describe('addKey', () => {
  test('object', () => {
    const source = { a: 'a' };
    expect(addKey(source, { b: 'b' })).toEqual({ a: 'a', b: 'b' });
  });

  test('objectArray', () => {
    const source = [{ a: 'a' }, { c: 'c' }];
    expect(addKey(source, { b: 'b' })).toEqual([
      { a: 'a', b: 'b' },
      { c: 'c', b: 'b' },
    ]);
  });
});

// ------------ transformKey -------------
describe('transformKey', () => {
  test('object', () => {
    const matcher = new Matcher({ test: '1' });
    expect(matcher.transformKey({ test: 'tag' }).data).toEqual({
      tag: '1',
    });
    expect(transformKey({ test: 1 }, { test: 'tag' })).toEqual({
      tag: 1,
    });
  });

  test('objectArray', () => {
    const source = [{ test: 1 }, { test: 2 }];
    expect(transformKey(source, { test: 'tag' })).toEqual([
      {
        tag: 1,
      },
      {
        tag: 2,
      },
    ]);
  });
});

// ------------ part -------------
describe('part', () => {
  test('object', () => {
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

  test('objectArray', () => {
    const source = [{ test: '1', b: '2' }];
    expect(
      part(source, 'test', () => {
        return 3;
      }),
    ).toEqual([
      {
        test: 3,
        b: '2',
      },
    ]);
  });
});

// ------------ transformValueType -------------
describe('transfromValueType', () => {
  test('object', () => {
    const source = { a: '1' };
    expect(transformValueType(source, { a: 'number' })).toEqual({
      a: 1,
    });
  });

  test('objectArray', () => {
    const source = [{ a: '1' }, { a: '2' }];
    expect(transformValueType(source, { a: 'number' })).toEqual([
      {
        a: 1,
      },
      {
        a: 2,
      },
    ]);
  });
});

// ------------ addKeyFn -------------
describe('addKeyFn', () => {
  test('object', () => {
    const source = { a: 1 };
    expect(
      addKeyFn(source, 'b', () => {
        return 1;
      }),
    ).toEqual({
      a: 1,
      b: 1,
    });
  });

  test('objectArray', () => {
    const source = [{ a: 1 }, { a: 2 }];
    expect(
      addKeyFn(source, 'b', () => {
        return 1;
      }),
    ).toEqual([
      {
        a: 1,
        b: 1,
      },
      {
        a: 2,
        b: 1,
      },
    ]);
  });
});

// ------------ transformEmpty -------------
describe('transformEmpty', () => {
  test('object', () => {
    expect(transformEmpty({ a: null, b: 'null', c: undefined })).toEqual({
      a: '',
      b: '',
      c: '',
    });
  });
  test('objectArray', () => {
    expect(
      transformEmpty([
        { a: null, b: 'null', c: undefined },
        {
          a: '"null"',
          b: 'undefined',
          c: '"undefined"',
        },
      ]),
    ).toEqual([
      {
        a: '',
        b: '',
        c: '',
      },
      {
        a: '',
        b: '',
        c: '',
      },
    ]);
  });
});

// ------------ remove -------------
describe('remove', () => {
  test('object', () => {
    expect(remove({ a: 1, b: 2 }, ['a'])).toEqual({
      b: 2,
    });
  });
  test('objectArray', () => {
    expect(remove([{ a: 1, b: 2 }, { a: 2, b: 3 }], ['a'])).toEqual([
      {
        b: 2,
      },
      {
        b: 3,
      },
    ]);
  });
});
