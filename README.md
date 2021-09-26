# 数据匹配器

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
import Matcher from 'data-matcher';
```

链式调用，将后端接口数据转换为前端的定义数据结构

## 全部 api

## 使用案例

## TODO

- [x] 精简 editValue 入参
- [x] 构建调整，旧版挪到 v1 目录
- [ ] 完善代码容错能力（校验数据并提示错误）
- [ ] 增加 github 自动构建功能
- [ ] 完善 README.md 文档
