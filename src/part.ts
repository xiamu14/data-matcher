/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:33:16
 * @LastEditTime: 2019-04-26 10:39:03
 */

export default function part(data: object, key: string, fn: Function) {
  if (!Object.prototype.hasOwnProperty.bind(data, key)) {
    throw new RangeError(`the data hasn't key ${key}`);
  }
  const target = data;
  target[key] = fn && fn(data[key]);
  return target;
}
