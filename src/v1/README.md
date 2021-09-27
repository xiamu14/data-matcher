# 数据匹配器

> v1 已经不推荐使用，请升级到 v2。

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
import Matcher from 'data-matcher/v1';
```

链式调用，将后端接口数据转换为前端的定义数据结构

```ts
const sourceData = {
  a: 1,
  b: '1',
};
const matcher = new Matcher(sourcedata);

const { data: targetData } = matcher
  .transformKey({ a: 'c' })
  .transformValueType({ b: number });
```

### 单独转换

单独引入转换函数，作用于元数据。

```ts
import { transformKey } from 'data-matcher';
const sourceData = {
  a: 1,
  b: '1',
};
const targetData = transfromKey(sourceData, { a: 'c' });
```

## 全部 api

- transformKey()

  转换对象数组中对象的 key 值

  - param

- output()

  导出数据

- toValuesArray()

  将对象展开成 value 的数组，如：  
  {1: 'a', 2: 'b' }  
  => ['a', 'b']

- addKey()

  将新对象遍历添加到，已知数组对象中的每一个属性的后面，如：  
  old = [{a : 'a'},{b:'b'}];  
  new = {c:'c'};  
  => [{a:'a',c:'c'},
  {b:'b',c:'c'}];

- addKeyFn()

  将新属性名和值拼接后，添进原对象，如：  
  addKeyFn( { a: 1 }, 'b', () => { return 2 } } )  
  => {a:1,b:2}

- transformKey()

  将数组对象每个对象属性值提出来，如：  
  [ { test: 1 }, { test: 2 } ]  
  => {tag: 1,},{tag:2}

- transformValueType()

  按对象属性类型转为 number || string || others，如：  
  (transformValueType({ a: '1' }, { a: 'number' }))  
  => { a:1 }

- transformEmpty()

  将带有 null/undefined 的每个属性的值都变为空字符串，如：  
  { a: null, b: 'null', c: undefined }  
  => { a:'' , b:'' , c:'' }

- part()

  给指定对象属性赋值，若属性不存在就添加属性并赋值如：  
  part( [ { test: '1', b: '2' } ] , 'test', ( ) => { return 3; } )  
  => { test : 3 , b : 2}

- remove()

  按属性名删除对象内属性，如：  
  remove ( { a: 1, b: 2 } , ['a'] )  
   => { b : 2 }

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/yangjianguo12"><img src="https://avatars3.githubusercontent.com/u/48900717?v=4" width="100px;" alt="yangjianguo12"/><br /><sub><b>yangjianguo12</b></sub></a><br /><a href="https://github.com/xiamu14/data-matcher/commits?author=yangjianguo12" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
