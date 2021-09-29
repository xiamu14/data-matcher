export function isObject(data: any): data is Object {
  return Object.prototype.toString.call(data) === '[object Object]';
}
