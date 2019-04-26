/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:18:15
 * @LastEditTime: 2019-04-26 10:23:21
 */

export default function transformValueType(data: object, map: object): object {
  const target = {};
  Object.keys(data).forEach(key => {
    if (map[key] === 'number') {
      target[key] = parseInt(data[key], 10);
    } else if (map[key] === 'string') {
      target[key] = data[key].toString();
    } else {
      target[key] = data[key];
    }
  });
  return target;
}
