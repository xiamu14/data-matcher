/*
 * @Description: 转换 key 的名字
 * @Type: function
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-25 11:17:37
 * @LastEditTime: 2019-04-25 11:19:24
 */

function _transformKey(data: object, map: object): object {
  const targetKeys = Object.keys(map);
  const target = {};
  Object.keys(data).forEach(key => {
    if (targetKeys.includes(key)) {
      target[map[key]] = data[key];
    } else {
      target[key] = data[key];
    }
  });
  return target;
}

export default function transformKey(data: object | object[], map: object) {
  let res = {};
  if (Array.isArray(data)) {
    res = data.map(item => _transformKey(item, map));
  } else {
    res = _transformKey(data, map);
  }
  return res;
}
