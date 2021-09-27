import deepClone from 'lodash.clonedeep';
import Queue from '../util/Queue';
import { DataItem, DataItemKey, DataType } from '../type';

class Matcher {
  private addRecord: Queue = new Queue();
  private deleteRecord: Queue = new Queue();
  private editValueRecord: Queue = new Queue();
  private editKeyRecord: Queue = new Queue();
  private originalData: any;
  private result: any;
  constructor(data: DataType) {
    this.originalData = deepClone(data);
    this.result = deepClone(data);
  }

  public get data() {
    // NOTE: 执行计算: 计算结果要缓存，如果再次获取需要，record 没有更新，则直接从缓存里获取
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
    // NOTE: 判断是否是数组
    if (Array.isArray(this.originalData)) {
      this.result = this.originalData.map((item) => {
        return this.convertItem(item);
      });
    } else {
      this.result = this.convertItem(this.originalData);
    }
  }

  private convertItem(originalDataItem: any) {
    const result: any = deepClone(originalDataItem);
    const noExitKeys = new Set<DataItemKey>(); // 存储不存在的 key，用于提示
    // NOTE: 处理顺序：增加数据-删除数据-修改 value - 修改 key
    if (!this.addRecord.isEmpty()) {
      this.addRecord.forEach((record) => {
        result[record['key']] = record['valueFn'](originalDataItem);
      });
    }
    if (!this.deleteRecord.isEmpty()) {
      this.deleteRecord.forEach((record) => {
        record.forEach((key: string) => {
          if (key in result) {
            delete result[key];
          } else {
            noExitKeys.add(key);
          }
        });
      });
    }
    if (!this.editValueRecord.isEmpty()) {
      this.editValueRecord.forEach((record) => {
        const { key, valueFn } = record;
        if (key in result) {
          const cloneValue =
            typeof result[key] === 'object'
              ? deepClone(result[key])
              : result[key];
          console.log('--cloneValue', cloneValue);
          result[key] = valueFn(cloneValue, originalDataItem);
        } else {
          noExitKeys.add(key);
        }
      });
    }

    if (!this.editKeyRecord.isEmpty()) {
      this.editKeyRecord.forEach((records) => {
        records.forEach((record: any) => {
          const { key, newKey } = record;
          if (key in result) {
            const cloneValue =
              typeof result[key] === 'object'
                ? deepClone(result[key])
                : result[key];
            result[newKey] = cloneValue;
            delete result[key];
          } else {
            noExitKeys.add(key);
          }
        });
      });
    }
    if (noExitKeys.size > 0) {
      let keyString = '';

      noExitKeys.forEach((item) => {
        keyString = `${keyString},${
          typeof item === 'symbol' ? String(item) : item
        }`;
      });
      console.warn(
        `key 错误： 以下 key [${keyString.substr(1)}] 不存在于数据中`,
      );
    }
    return result;
  }

  public add(key: DataItemKey, valueFn: (data: DataItem) => any) {
    const record = { key, valueFn };
    this.addRecord.enqueue(record);
    return this;
  }

  public delete(keys: DataItemKey[]) {
    this.deleteRecord.enqueue(keys);
    return this;
  }

  public editValue(
    key: DataItemKey,
    valueFn: (value: any, data: DataItem) => any,
  ) {
    const record = { key, valueFn };
    this.editValueRecord.enqueue(record);
    return this;
  }

  public editKey(keyMap: Record<DataItemKey, DataItemKey>) {
    const records: { key: DataItemKey; newKey: DataItemKey }[] = [];
    Object.keys(keyMap).forEach((key) => {
      records.push({ key, newKey: keyMap[key] });
    });
    this.editKeyRecord.enqueue(records);
    return this;
  }
}

export default Matcher;
