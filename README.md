## 数据匹配器

## 安装

```
yarn add data-matcher
npm install data-matcher
```

### 使用

链式调用，将后端接口数据转换为前端的定义数据结构

```js
import matcher from 'data-matcher'

const data = {
  a: 1,
  b: '1',
}

const res = matcher
  .input(data)
  .transformKey({ a: 'c' })
  .transformValueType({ b: number })
  .output() // {c: 1, b: 1}
```

### Api

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
