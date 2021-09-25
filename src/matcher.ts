import { DataItem } from './type';

class Queue {
  items: DataItem[];
  constructor() {
    this.items = [];
  }

  enqueue(item: DataItem) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  forEach(callback: (item: DataItem, index: number) => void) {
    let index = 0;
    const action = () => {
      if (!this.isEmpty()) {
        const item = this.dequeue();
        if (item) {
          callback(item, index);
          index += 1;
          action();
        }
      }
    };
    action();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const deepClone = (obj: DataItem) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]),
  );
  if (Array.isArray(clone)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

class Matcher {
  private addRecord: Queue = new Queue();
  private deleteRecord: Queue = new Queue();
  private editValueRecord: Queue = new Queue();
  private editKeyRecord: Queue = new Queue();
  private originalData: any;
  private result: any;
  constructor(data: any) {
    this.originalData = deepClone(data);
    this.result = deepClone(data);
  }

  public get data() {
    // TODO: 执行计算: 计算结果要缓存，如果再次获取需要，record 没有更新，则直接从缓存里获取
    if (this.shouldConvert()) {
      this.convert();
    }
    return this.result;
  }

  public shouldConvert() {
    return (
      !this.addRecord.isEmpty() ||
      !this.deleteRecord.isEmpty() ||
      !this.editValueRecord.isEmpty() ||
      !this.editKeyRecord.isEmpty()
    );
  }

  private convert() {
    // TODO: 处理顺序：增加数据-删除数据-修改 value - 修改 key
    // TODO：判断 addRecord.isEmpty
    this.result = deepClone(this.originalData); // 重置缓存
    if (!this.addRecord.isEmpty()) {
      this.addRecord.forEach((record) => {
        this.result[record['key']] = record['valueFn'](this.originalData);
      });
    }
    if (!this.deleteRecord.isEmpty()) {
      this.deleteRecord.forEach((record) => {
        record.forEach((key: string) => {
          delete this.result[key];
        });
      });
    }
    if (!this.editValueRecord.isEmpty()) {
      this.editValueRecord.forEach((record) => {
        this.result[record['key']] = record['valueFn'](this.originalData);
      });
    }

    if (!this.editKeyRecord.isEmpty()) {
      this.editKeyRecord.forEach((records) => {
        // FIXME: 判断是否存在
        records.forEach((record: any) => {
          const cloneValue =
            typeof this.result[record['key']] === 'object'
              ? deepClone(this.result[record['key']])
              : this.result[record['key']];
          this.result[record['newKey']] = cloneValue;
          delete this.result[record['key']];
        });
      });
    }
  }

  public add(record: { key: string; valueFn: (data: any) => any }) {
    this.addRecord.enqueue(record);
    return this;
  }

  public delete(keys: string[]) {
    this.deleteRecord.enqueue(keys);
    return this;
  }

  public editValue(record: {
    key: string;
    valueFn: (item: any, data: any) => any;
  }) {
    this.editValueRecord.enqueue(record);
    return this;
  }

  public editKey(records: { key: string; newKey: string }[]) {
    this.editKeyRecord.enqueue(records);
    return this;
  }
}

export default Matcher;
