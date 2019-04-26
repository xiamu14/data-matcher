/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:29:22
 * @LastEditTime: 2019-04-26 10:30:47
 */

export default function addKeyFn(
  data: object,
  key: string,
  fn: Function,
): object {
  const target = data;
  target[key] = fn && fn(data);
  return target;
}
