/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:24:30
 * @LastEditTime: 2019-04-26 10:25:40
 */
import supportArray from './util/supportArray';
import _isEqual from 'lodash.isequal';

function _transfromEmpty(
  data: object,
  map?: { sVal: any; tVal: 0 | [] | {} | ''; keys?: string[] },
): object {
  const target = <object>{};
  Object.keys(data).forEach(key => {
    if (
      data[key] === null ||
      data[key] === 'null' ||
      data[key] === '"null"' ||
      data[key] === undefined ||
      data[key] === 'undefined' ||
      data[key] === '"undefined"'
    ) {
      target[key] = map?.tVal !== undefined ? map.tVal : '';
    } else {
      target[key] = data[key];
    }
    if (_isEqual(data[key], map?.sVal)) {
      if (map?.keys && map.keys.indexOf(key) !== -1) {
      } else {
        target[key] = map?.tVal !== undefined ? map.tVal : '';
      }
    }
  });
  return target;
}
/**
 * @description 将 null,undefined, "undefined" 等转换为 空字符串 ‘’
 * @param {object | object[]} data
 */
export default function transfromEmpty(data: object | object[], map?: object) {
  return supportArray(_transfromEmpty, data, map);
}
