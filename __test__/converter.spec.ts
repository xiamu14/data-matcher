import { Converter } from '../dist';

const converter1 = new Converter({ name: 'neo' });
const converter2 = new Converter([{ name: 'neo1' }, { name: 'neo2' }]);

describe('add', () => {
  test('object', () => {
    expect(converter1.add({ age: 12 }).outcome).toEqual({
      name: 'neo',
      age: 12,
    });
  });
  test('object', () => {
    expect(
      converter1
        .add({ age: 12 })
        .convertValue({ name: 'neo1' })
        .convertKey({ name: 'nickname' }).outcome,
    ).toEqual({
      nickname: 'neo1',
      age: 12,
    });
  });
  test('object array', () => {
    expect(converter2.add({ age: 12 }).remove(['name']).outcome).toEqual([
      { name: 'neo1' },
      { name: 'neo2' },
    ]);
  });
});
