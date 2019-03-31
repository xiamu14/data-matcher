/*
 * @Description: 数据处理中间价
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-03-17 13:36:19
 * @LastEditTime: 2019-03-31 23:02:32
 */

class Matcher {
  data: object | object[]

  input(data) {
    this.data = data
    return this
  }

  output() {
    return this.data
  }

  // 处理的是 val
  toValuesArray() {
    const { data } = this
    this.data = Object.values(data)
    return this
  }

  // 转换 key 值，处理的是对象
  transformKey(map) {
    const { data } = this
    const targetKeys = Object.keys(map)
    const target = {}
    Object.keys(data).forEach(key => {
      if (targetKeys.includes(key)) {
        target[map[key]] = data[key]
      } else {
        target[key] = data[key]
      }
    })
    this.data = target
    return this
  }

  // 转换 value 值类型，处理的是对象
  transformValueType(map) {
    const { data } = this
    const target = {}
    Object.keys(data).forEach(key => {
      if (map[key] === 'number') {
        target[key] = parseInt(data[key], 10)
      } else if (map[key] === 'string') {
        target[key] = data[key].toString()
      } else {
        target[key] = data[key]
      }
    })
    this.data = target
    return this
  }

  // 将所有的非值字段转换为空字符串，处理的是对象
  transformEmpty() {
    const { data } = this
    const target = <object>{}
    Object.keys(data).forEach(key => {
      if (
        data[key] === null ||
        data[key] === 'undefined' ||
        data[key] === '"undefined"'
      ) {
        target[key] = ''
      } else {
        target[key] = data[key]
      }
    })
    this.data = target
    return this
  }

  // 增加默认字段，处理的是对象
  addKey(map) {
    const { data } = this
    const target = data
    Object.keys(map).forEach(key => {
      target[key] = map[key]
    })
    this.data = target
    return this
  }

  // 增加字段，val 值由外部函数定义
  addKeyVal(key, fn) {
    const { data } = this
    const target = data
    target[key] = fn && fn(data)
    this.data = target
    return this
  }

  // 添加函数，处理 data 里的部分数据
  part(key, fn) {
    const data = this.data
    this.data[key] = fn && fn(data[key])
    return this
  }

  // 根据 key 值分类，处理的是数组
  classifyKey(key) {
    const { data } = this
    const target = []
    ;(data as Array<Object>).forEach(item => {
      const val = item[key]
      if (!Object.keys(target).includes(val.toString())) {
        target[val] = []
      }
      target[val].push(item)
    })
    this.data = target
    return this
  }
}

const matcher = new Matcher()

export default matcher
