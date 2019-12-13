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

export interface TMap {
  sVal: any;
  tVal: any;
  keys?: string[];
}

function _transfromVal(data: object, map: TMap): object {
  const target = { ...data };
  const sKeys = Object.keys(data);
  const tKeys = sKeys.filter(key => _isEqual(data[key], map.sVal));
  if (map?.keys) {
    const rKeys = tKeys.filter(key => map.keys?.indexOf(key) !== -1);
    rKeys.map(key => {
      target[key] = map.tVal;
    });
  } else {
    tKeys.map(key => {
      target[key] = map.tVal;
    });
  }

  return target;
}
/**
 * @description 将 null,undefined, "undefined" 等转换为 空字符串 ‘’
 * @param {object | object[]} data
 */
export default function transfromVal(data: object | object[], map: TMap): any {
  return supportArray(_transfromVal, data, map);
}
