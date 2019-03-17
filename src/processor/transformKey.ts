/*
 * @Description: 转换 key 值
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-03-17 20:23:36
 * @LastEditTime: 2019-03-17 22:18:23
 */

function processor(data: object, map: object): object {
  const targetKeys = Object.keys(map)
  const target = {}
  Object.keys(data).forEach((key) => {
    if (targetKeys.includes(key)) {
      target[map[key]] = data[key]
    } else {
      target[key] = data[key]
    }
  });
  return target
}

export default function transformKey(map: any, path: string) {
  return {
    name: 'transformKey',
    version: '1.0.0',
    param: [map, path],
    func: processor,
  }
}
