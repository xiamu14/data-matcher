
### 使用
```ts

import adapter, { transformKey, transformValType } from 'data-adapter'

interface sourceData = {
  name: string,
  avatar: string,
  age: string
}

interface targetData = {
  nicknamne: string,
  avatar: string,
  age: number,
}

const data : sourceData = {
  ...
}

const res: targetData = adapter(
  data, 
  transformKey({name: 'nickname'}),
  transformValType({age: number}),
)

```
