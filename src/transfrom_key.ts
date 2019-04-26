/*
 * @Description: 转换 key 的名字
 * @Type: function
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-25 11:17:37
 * @LastEditTime: 2019-04-25 11:19:24
 */

export default function transfromKey(data: object, map: object): object {
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
