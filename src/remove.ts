/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:33:16
 * @LastEditTime: 2019-05-22 11:17:07
 */

import supportArray from './util/supportArray';

function _remove(data: object | object[], keys: string[]) {
  const target = data;

  keys.map(key => {
    delete target[key];
  });

  return target;
}

export default function remove(data: object | object[], keys: string[]) {
  return supportArray(_remove, data, keys);
}
