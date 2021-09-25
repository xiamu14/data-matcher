/*
 * @Description: 将对象转换为数组，扁平化
 * @Type: function
 * @Author: Ben
 * @LastEditors: Ben
 * @Date: 2019-04-25 11:15:21
 * @LastEditTime: 2019-04-25 11:17:18
 */
import supportArray from '../util/supportArray';

function _toValuesArray(data: Object): any[] {
  return Object.values(data);
}

export default function toValuesArray(data: object | object[]): any {
  return supportArray(_toValuesArray, data);
}
