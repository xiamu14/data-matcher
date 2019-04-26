/*
 * @Description: 数据处理中间件
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-03-17 13:36:19
 * @LastEditTime: 2019-04-26 10:44:32
 */
import toValuesArray from './to_values_array';
import transformKey from './transfrom_key';
import transformValueType from './transform_value_type';
import transformEmpty from './transform_empty';
import addKey from './add_key';
import part from './part';
import addKeyFn from './add_key_fn';
import classifyKey from './classify_key';

type sourceData = object | object[];

class Matcher {
  data: sourceData;

  constructor(data: sourceData) {
    this.data = data;
  }

  // 处理的是 val
  toValuesArray() {
    this.data = toValuesArray(this.data);
    return this;
  }

  // 转换 key 值，处理的是对象
  transformKey(map) {
    this.data = transformKey(this.data, map);
    return this;
  }

  // 转换 value 值类型，处理的是对象
  transformValueType(map) {
    this.data = transformValueType(this.data, map);
    return this;
  }

  // 将所有的非值字段转换为空字符串，处理的是对象
  transformEmpty() {
    this.data = transformEmpty(this.data);
    return this;
  }

  // 增加默认字段，处理的是对象
  addKey(map) {
    this.data = addKey(this.data, map);
    return this;
  }

  // 增加字段，val 值由外部函数定义
  addKeyFn(key, fn) {
    this.data = addKeyFn(this.data, key, fn);
    return this;
  }

  // 添加函数，处理 data 里的部分数据
  part(key, fn) {
    this.data = part(this.data, key, fn);
    return this;
  }
}

export default Matcher;
