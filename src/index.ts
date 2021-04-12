/*
 * @Description: 数据处理中间件
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-03-17 13:36:19
 * @LastEditTime: 2019-05-22 11:16:49
 */
import {
  transformKey,
  toValuesArray,
  transformValueType,
  transformEmpty,
  transformVal,
  addKey,
  part,
  addKeyFn,
  // classifyKey,
  remove,
  TMap,
} from './lib';
export { Converter } from './core/converter';
type SourceData = object | object[];

class Matcher {
  data: SourceData;

  constructor(data: SourceData) {
    this.data = data;
  }

  // 处理的是 val
  toValuesArray() {
    this.data = toValuesArray(this.data);
    return this;
  }

  // 转换 key 值，处理的是对象
  transformKey(map: Record<string, string>) {
    this.data = transformKey(this.data, map);
    return this;
  }

  // 转换 value 值类型，处理的是对象
  transformValueType(map: Record<string, any>) {
    this.data = transformValueType(this.data, map);
    return this;
  }

  // 将所有的非值字段转换为空字符串，处理的是对象
  transformEmpty() {
    this.data = transformEmpty(this.data);
    return this;
  }

  transformVal(map: TMap) {
    this.data = transformVal(this.data, map);
    return this;
  }

  // 增加默认字段，处理的是对象
  addKey(map: Record<string, any>) {
    this.data = addKey(this.data, map);
    return this;
  }

  // 增加字段，val 值由外部函数定义
  addKeyFn(key: string, fn: Function) {
    this.data = addKeyFn(this.data, key, fn);
    return this;
  }

  // 添加函数，处理 data 里的部分数据
  part(key: string, fn: Function, copy?: string) {
    this.data = part(this.data, key, fn, copy);
    return this;
  }
  // 删除某个字段
  remove(keys: string[]) {
    this.data = remove(this.data, keys);
    return this;
  }
}

//  返回一个实例引用
export const matcher = (data: SourceData) => {
  return new Matcher(data);
};

export default Matcher;

export {
  transformKey,
  toValuesArray,
  transformValueType,
  transformEmpty,
  transformVal,
  addKey,
  part,
  addKeyFn,
  remove,
};
