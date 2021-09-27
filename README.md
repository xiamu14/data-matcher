# 数据匹配器

> 本文档是 v2 版本内容，v1 版本已经处于废弃 ⚠️ 阶段，请及时升级（codeMod 正在开发中，当前请手动修改）。维护阶段如果仍需参考 v1 文档，请访问 [v1 文档](https://github.com/xiamu14/data-matcher/blob/master/src/v1/README.md)

## data-matcher 用途

## 安装

```
yarn add data-matcher
```

```
pnpm install data-matcher
```

## data-matcher 使用

```js
const data = { a: 'a', b: 'b' };
const matcher = new Matcher(data);
matcher
  .add('c', () => 'c')
  .delete(['b'])
  .editValue('a', () => 'aa');
matcher.data; // { a: 'aa', c: 'c' }
```

## data-matcher 方法

### add 增加数据

- 定义：
  ```js
  public add(key: DataItemKey, valueFn: (data: any) => any)
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | key | 键 | -- | string 或 Symbol |
  | valueFn | 值的生成函数 | -- | (data: any) => any |

### delete 删除数据

- 定义：
  ```js
  public delete(keys: DataItemKey[])
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | keys | 键数组 | -- | 包含 string 或 Symbol 的数组 |

### editValue 修改 value

### editKey 修改 key

## data-matcher 特性

1. immutable：内部使用 cloneDeep 函数，对传入的数据进行深拷贝，所有修改不影响原始数据
   ```js
   constructor(data: any) {
    this.originalData = deepClone(data);
    this.result = deepClone(data);
   }
   ```
2. 方法调用顺序无关：可以自由使用链式调用方法，内部使用固定的方法执行顺序（add[增加数据]->delete[删除数据]->editValue[修改 value] -> editKey[修改 key]）调用对应的方法来执行，确保数据操作的正确性
   ```js
   // 源码测试用例
   test('valueDelivery', () => {
     const data = { a: 'a', b: 'b' };
     const matcher = new Matcher(data);
     matcher
       .add('c', () => 'c')
       .delete(['b'])
       .editValue('a', () => 'aa');
     expect(matcher.data).toEqual({ a: 'aa', c: 'c' }); // pass
     // 顺序无关
     matcher
       .editValue('a', () => 'aa')
       .add('c', () => 'c')
       .delete(['b']);
     expect(matcher.data).toEqual({ a: 'aa', c: 'c' }); // pass
   });
   ```
3. 归纳操作：Matcher 内部会收集所有调用方法，便于对数组数据只使用一次遍历完成数据操作
4. 链式调用：使用链式调用方法，对数据的操作代码更有组织性

## 使用案例

### Ant Design 的 select 组件

## TODO

- [x] 精简 editValue 入参
- [x] 构建调整，旧版挪到 v1 目录
- [x] 完善代码容错能力（校验数据并提示错误）
- [ ] 完善 README.md / package.json
- [ ] 增加 github 自动构建功能
- [ ] 增加性能测试（10w 数据处理耗时，二次获取数据缓存验证）
