/*
 * @Description:根据 key 值分类，处理的是数组
 * @Type:
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-26 10:39:22
 * @LastEditTime: 2019-04-26 10:43:12
 */

export default function classifyKey(data: object[], key: string): object {
  const target = [];
  data.forEach(item => {
    const val = item[key];
    if (!Object.keys(target).includes(val.toString())) {
      target[val] = [];
    }
    target[val].push(item);
  });
  return target;
}
