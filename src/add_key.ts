/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:27:37
 * @LastEditTime: 2019-04-26 10:28:39
 */
import supportArray from './util/supportArray';

function _addKey(data: object, map: object): object {
  const target = data;
  Object.keys(map).forEach(key => {
    target[key] = map[key];
  });
  return target;
}

export default function addKey(data: object | object[], params: object): any {
  return supportArray(_addKey, data, params);
}
