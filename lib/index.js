(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['data-matcher'] = factory());
}(this, function () { 'use strict';

  /*
   * @Description:
   * @Author: Ben
   * @LastEditors: Ben
   * @Date: 2019-03-17 13:36:19
   * @LastEditTime: 2019-03-17 23:30:42
   */
  var Matcher = /** @class */ (function () {
      function Matcher() {
      }
      Matcher.prototype.input = function (data) {
          this.data = data;
          return this;
      };
      Matcher.prototype.output = function () {
          return this.data;
      };
      // 处理的是 val
      Matcher.prototype.toValuesArray = function () {
          var data = this.data;
          this.data = Object.values(data);
          return this;
      };
      // 转换 key 值，处理的是对象
      Matcher.prototype.transformKey = function (map) {
          var data = this.data;
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
          this.data = target;
          return this;
      };
      // 转换 value 值类型，处理的是对象
      Matcher.prototype.transformValueType = function (map) {
          var data = this.data;
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
          this.data = target;
          return this;
      };
      // 将所有的非值字段转换为空字符串，处理的是对象
      Matcher.prototype.transformEmpty = function () {
          var data = this.data;
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
          this.data = target;
          return this;
      };
      // 增加默认字段，处理的是对象
      Matcher.prototype.addKey = function (map) {
          var data = this.data;
          var target = data;
          Object.keys(map).forEach(function (key) {
              target[key] = map[key];
          });
          this.data = target;
          return this;
      };
      // 增加字段，val 值由外部函数定义
      Matcher.prototype.addKeyVal = function (key, fn) {
          var data = this.data;
          var target = data;
          target[key] = fn && fn(data);
          this.data = target;
          return this;
      };
      // 根据 key 值分类，处理的是数组
      Matcher.prototype.classifyKey = function (key) {
          var data = this.data;
          var target = [];
          data.forEach(function (item) {
              var val = item[key];
              if (!Object.keys(target).includes(val.toString())) {
                  target[val] = [];
              }
              target[val].push(item);
          });
          this.data = target;
          return this;
      };
      return Matcher;
  }());
  var matcher = new Matcher();

  return matcher;

}));
