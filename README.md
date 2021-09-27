## 数据适配器

> 本文档是 v2 版本内容，v1 版本已经处于废弃 ⚠️ 阶段，请及时升级（codeMod 正在开发中，当前请手动修改）。维护阶段如果仍需参考 v1 文档，请访问 [v1 文档](https://github.com/xiamu14/data-matcher/blob/master/src/v1/README.md)

## 用途

在数据处理过程中，不同环节所储存或反馈的数据字段，类型总会存在差异。

服务端 api 数据和前端数据的差异，前端组件和第三方组件数据的差异，数据在不同环节的差异等。

如果基于同一领域，同一场景，同一产品的认知，这种差异往往只是数据表象的差异，比如：key 命名不一致，value 数据类型不同，数据原始或复合状态不同。

通过开发经验归纳，大致有下面三种差异：

1. 初始数据和使用时数据的复合形态不同：初始数据应该包含产品所需的全部内容，但在使用时可以需要不同的复合形态，比如：select 选项初始数据包含 {id,name}，第三方组件使用时需要 {key,value,label}。[add ，delete 方法组合使用可抹平差异]
2. key 命名不一致 [editKey 方法可修改 key]
3. value 数据类型不一致 [editValue 方法可修改 value]

当然，实际开发中还存在更复杂的差异，那样的情状建议特例化处理。

## 安装

```
yarn add data-matcher
```

```
pnpm install data-matcher
```

## 使用

```js
const data = { a: 'a', b: 'b' };
const matcher = new Matcher(data);
matcher
  .add('c', () => 'c')
  .delete(['b'])
  .editValue('a', () => 'aa');
matcher.data; // { a: 'aa', c: 'c' }
```

## 方法

### add (增加数据)

- 定义：
  ```js
  public add(key: DataItemKey, valueFn: (data: any) => any)
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | key | 键 | -- | string 或 Symbol |
  | valueFn | 值的生成函数 | -- | (data: DataItem) => any |

- 示例

### delete (删除数据)

- 定义：
  ```js
  public delete(keys: DataItemKey[])
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | keys | 键数组 | -- | 包含 string 或 Symbol 的数组 |

- 示例

### editValue (修改 value)

- 定义：
  ```js
  public editValue(
    key: DataItemKey,
    valueFn: (value: any, data: DataItem) => any,
  )
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | key | 键 | -- | string 或 Symbol |
  | valueFn | 值的生成函数 | -- | (key:any, data: DataItem) => any |

- 示例

### editKey (修改 key)

- 定义：
  ```js
  public editKey(keyMap: Record<DataItemKey, DataItemKey>)
  ```
- 参数
  | 参数 | 描述 | 默认值 | 类型 |
  | ------ | ----------- | ------ | ------ |
  | keyMap | 新旧 key 对象 | -- | {旧 key：新 key} |

- 示例

## 特性

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

## TODO

- [x] 精简 editValue 入参
- [x] 构建调整，旧版挪到 v1 目录
- [x] 完善代码容错能力（校验数据并提示错误）
- [x] 优化类型描述（提供更准确的内容描述）
- [ ] 处理 'potential security vulnerabilities in your dependencies.' 提示
- [ ] 完善 README.md / package.json
- [ ] 增加 github 自动构建功能
- [ ] 增加性能测试（10w 数据处理耗时，二次获取数据缓存验证）
