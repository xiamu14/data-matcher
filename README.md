## 数据匹配器

## 安装

```
yarn add data-matcher
npm install data-matcher
```

## data-matcher 的使用方式

data-matcher 包含两种使用方式：组合转换、单独转换。

当元数据与目标数据的结构差异较大，需要经过多种转换器共同作用时适合使用组合转换的方式。

当数据源与目标数据的差异较小，使用单独的转换器即可实现数据转换时。

### 组合转换

引入 Matcher 类
```ts
import Matcher from 'data-matcher'
```

链式调用，将后端接口数据转换为前端的定义数据结构

```ts
const sourceData = {
  a: 1,
  b: '1',
}
const matcher = new Matcher(sourcedata)

const { data:targetData} = matcher
  .transformKey({ a: 'c' })
  .transformValueType({ b: number })
```

### 单独转换
单独引入转换函数，作用于元数据。

```ts
import { transformKey } from 'data-matcher';
const sourceData = {
  a: 1,
  b: '1'
}
const targetData = transfromKey(sourceData, {a: 'c'})
```

## 全部 api

- input()

  导入数据

- output()

  导出数据

- toValuesArray()

  将对象展开成 value 的数组，如：
  {1: 'a', 2: 'b' } => ['a', 'b']

- transformKey()

- transformValueType()

- transformEmpty()

- addKey()

- addKeyVal()

- classifyKey()

## 使用案例

调整数据结构

array -> object

object -> array

```ts
// 支持深度嵌套的数据
matcher
  .structure<oldStructure, newStructure>(source: Isource) // 包含 classifyKey 功能
  .transform({ key: { oldName: newName }, val: { newName: type } })
  .compotuped({
    addKeyVal: target => {},
    toEmpty: target => {}, // null, undefined, '0' => ''
  })

matcher.data:Itarget // 就是新数据了
```
