/*
 * @Description: core feature
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-03-17 15:12:54
 * @LastEditTime: 2019-03-17 22:20:58
 */

export default function core(data, ...processors) {
  let source = {}
  processors.forEach((p) => {
    source = p.func(data, p.param.map)
  })
}
