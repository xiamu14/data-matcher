/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:33:16
 * @LastEditTime: 2019-05-22 11:17:07
 */

export default function part(
  data: object,
  key: string,
  fn: Function,
  copy?: string,
) {
  if (!Object.prototype.hasOwnProperty.bind(data, key)) {
    throw new RangeError(`the data hasn't key ${key}`);
  }
  const target = data;
  if (copy) {
    target[copy] = fn(data[key]);
  } else {
    target[key] = fn(data[key]);
  }
  return target;
}
