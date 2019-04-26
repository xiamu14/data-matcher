/*
 * @Description:
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:24:30
 * @LastEditTime: 2019-04-26 10:25:40
 */

export default function transfromEmpty(data: object): object {
  const target = <object>{};
  Object.keys(data).forEach(key => {
    if (
      data[key] === null ||
      data[key] === 'undefined' ||
      data[key] === '"undefined"'
    ) {
      target[key] = '';
    } else {
      target[key] = data[key];
    }
  });
  return target;
}
