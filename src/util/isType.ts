export function isObject(data: any): data is Object {
  return Object.prototype.toString.call(data) === '[object Object]';
}

export function isNotEmptyArray<T>(param: unknown): param is T[] {
  if (Array.isArray(param) && param.length > 0) {
    return true;
  }
  return false;
}
