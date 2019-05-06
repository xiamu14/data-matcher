(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['data-matcher'] = {}));
}(this, function (exports) { 'use strict';

  /*
   * @Description: 将对象转换为数组，扁平化
   * @Type: function
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-25 11:15:21
   * @LastEditTime: 2019-04-25 11:17:18
   */
  function toValuesArray(data) {
      return Object.values(data);
  }

  /*
   * @Description: 转换 key 的名字
   * @Type: function
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-25 11:17:37
   * @LastEditTime: 2019-04-25 11:19:24
   */
  function transfromKey(data, map) {
      var targetKeys = Object.keys(map);
      var target = {};
      Object.keys(data).forEach(function (key) {
          if (targetKeys.includes(key)) {
              target[map[key]] = data[key];
          }
          else {
              target[key] = data[key];
          }
      });
      return target;
  }

  /*
   * @Description:
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:18:15
   * @LastEditTime: 2019-04-26 10:23:21
   */
  function transformValueType(data, map) {
      var target = {};
      Object.keys(data).forEach(function (key) {
          if (map[key] === 'number') {
              target[key] = parseInt(data[key], 10);
          }
          else if (map[key] === 'string') {
              target[key] = data[key].toString();
          }
          else {
              target[key] = data[key];
          }
      });
      return target;
  }

  /*
   * @Description:
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:24:30
   * @LastEditTime: 2019-04-26 10:25:40
   */
  function transfromEmpty(data) {
      var target = {};
      Object.keys(data).forEach(function (key) {
          if (data[key] === null ||
              data[key] === 'undefined' ||
              data[key] === '"undefined"') {
              target[key] = '';
          }
          else {
              target[key] = data[key];
          }
      });
      return target;
  }

  /*
   * @Description:
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:27:37
   * @LastEditTime: 2019-04-26 10:28:39
   */
  function addKey(data, map) {
      var target = data;
      Object.keys(map).forEach(function (key) {
          target[key] = map[key];
      });
      return target;
  }

  /*
   * @Description:
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:33:16
   * @LastEditTime: 2019-04-26 10:39:03
   */
  function part(data, key, fn) {
      if (!Object.prototype.hasOwnProperty.bind(data, key)) {
          throw new RangeError("the data hasn't key " + key);
      }
      var target = data;
      target[key] = fn && fn(data[key]);
      return target;
  }

  /*
   * @Description:
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:29:22
   * @LastEditTime: 2019-04-26 10:30:47
   */
  function addKeyFn(data, key, fn) {
      var target = data;
      target[key] = fn && fn(data);
      return target;
  }

  /*
   * @Description:根据 key 值分类，处理的是数组
   * @Type:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-04-26 10:39:22
   * @LastEditTime: 2019-04-26 10:43:12
   */
  function classifyKey(data, key) {
      var target = [];
      data.forEach(function (item) {
          var val = item[key];
          if (!Object.keys(target).includes(val.toString())) {
              target[val] = [];
          }
          target[val].push(item);
      });
      return target;
  }

  exports.toValuesArray = toValuesArray;
  exports.transformKey = transfromKey;
  exports.transformValueType = transformValueType;
  exports.transformEmpty = transfromEmpty;
  exports.addKey = addKey;
  exports.part = part;
  exports.addKeyFn = addKeyFn;
  exports.classifyKey = classifyKey;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
