/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:33:16
 * @LastEditTime: 2019-05-22 11:17:07
 */

function _remove(data: object | object[], keys: string[]) {
  const target = data;

  keys.forEach(key => {
    delete target[key];
  });

  return target;
}

export default function remove(data: object | object[], keys: string[]) {
  let res = {};
  if (Array.isArray(data)) {
    res = data.map(item => _remove(data, keys));
  } else {
    res = _remove(data, keys);
  }
  return res;
}
