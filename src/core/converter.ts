type SourceType = Record<any, any> | any[];

interface RecordType {
  fn: convertFn;
  params: any;
  index: number;
}
// 处理流 ['add','remove'] -> ['derivative'] -> ['convertValue'] -> ['convertKey'] -> ['classify']

type convertFn =
  | 'add'
  | 'remove'
  | 'derivative'
  | 'convertValue'
  | 'convertKey';
function isArray(data: any): data is Array<any> {
  return Array.isArray(data);
}

function isObject(data: any): data is Record<any, any> {
  return Object.prototype.toString.call(data) === '[object Object]';
}

export class Converter {
  private data: SourceType;
  private record: RecordType[] = [];
  private index: number = 0;

  constructor(data: SourceType) {
    if (isArray(data)) {
      const [...copy] = data;
      this.data = copy;
    } else if (isObject(data)) {
      const { ...copy } = data;
      this.data = copy;
    } else {
      throw new Error('不支持的数据类型');
    }
  }

  private writeRecord(fn: convertFn, params: any) {
    this.record.push({
      fn,
      params,
      index: this.index,
    });
    this.index += 1;
  }

  /**
   * 转换键名
   * @param map
   * @returns
   */
  public convertKey(map: Record<string, string>) {
    this.writeRecord('convertKey', map);
    return this;
  }

  /**
   * 主要用于转换数据的值部分，比如统一数据里的 null , undefined , 'null' 等
   * @param map
   * @returns
   */
  public convertValue(map: Record<string, string>) {
    this.writeRecord('convertValue', map);
    return this;
  }

  /**
   * 删除数据
   */
  public remove(keys: string[]) {
    if (isObject(this.data)) {
      keys.forEach((key) => {
        delete this.data[key];
      });
    } else {
      this.writeRecord('remove', keys);
    }
    return this;
  }

  /**
   * 增加数据
   */
  public add(data: SourceType) {
    if (isArray(data) && isArray(this.data)) {
      this.data = [...this.data, ...data];
    } else if (isObject(data) && isObject(this.data)) {
      this.data = { ...this.data, ...data };
    } else if (isObject(data) && isArray(this.data)) {
      this.writeRecord('add', data);
    } else {
      throw new Error(`数据类型不匹配：${typeof data} 无法合并`);
    }
    return this;
  }

  /**
   * 衍生，根据当前数据及生成器函数，衍生出新的数据字段
   * @param map
   * @returns
   */
  public derivative(key: string, fn: Function) {
    if (isObject(this.data)) {
      this.data = { ...this.data, ...{ key: fn(this.data) } };
    } else if (isArray(this.data)) {
      this.writeRecord('derivative', { key, fn });
    }

    return this;
  }

  /**
   * 根据键值自动分类
   */
  public classifyByKey() {}

  /**
   * 实际转换函数
   */
  private convert() {
    const records = this.record.sort((a, b) => a.index - b.index);
    if (isObject(this.data)) {
      Object.keys(this.data).forEach((dataKey) => {
        const dataValue = this.data[dataKey];
        records.forEach((record) => {
          const targetKeys = Object.keys(record.params);
          switch (record.fn) {
            case 'convertKey':
              if (targetKeys.includes(dataKey)) {
                this.data[targetKeys[dataKey]] = dataValue;
                delete this.data[dataKey];
              }
              break;
            case 'convertValue':
              if (targetKeys.includes(dataKey)) {
                this.data[dataKey] = record.params[dataKey];
              }
            default:
              break;
          }
        });
      });
    }
  }

  /**
   * 产出值
   */
  get outcome() {
    if (this.record.length > 0) {
      this.convert();
    }
    return this.data;
  }
}
