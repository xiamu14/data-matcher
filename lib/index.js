(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['data-matcher'] = factory());
}(this, function () { 'use strict';

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
   * @Description: 数据处理中间件
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-03-17 13:36:19
   * @LastEditTime: 2019-04-26 10:44:32
   */
  var Matcher = /** @class */ (function () {
      function Matcher(data) {
          this.data = data;
      }
      // 处理的是 val
      Matcher.prototype.toValuesArray = function () {
          this.data = toValuesArray(this.data);
          return this;
      };
      // 转换 key 值，处理的是对象
      Matcher.prototype.transformKey = function (map) {
          this.data = transfromKey(this.data, map);
          return this;
      };
      // 转换 value 值类型，处理的是对象
      Matcher.prototype.transformValueType = function (map) {
          this.data = transformValueType(this.data, map);
          return this;
      };
      // 将所有的非值字段转换为空字符串，处理的是对象
      Matcher.prototype.transformEmpty = function () {
          this.data = transfromEmpty(this.data);
          return this;
      };
      // 增加默认字段，处理的是对象
      Matcher.prototype.addKey = function (map) {
          this.data = addKey(this.data, map);
          return this;
      };
      // 增加字段，val 值由外部函数定义
      Matcher.prototype.addKeyFn = function (key, fn) {
          this.data = addKeyFn(this.data, key, fn);
          return this;
      };
      // 添加函数，处理 data 里的部分数据
      Matcher.prototype.part = function (key, fn) {
          this.data = part(this.data, key, fn);
          return this;
      };
      return Matcher;
  }());

  return Matcher;

}));
