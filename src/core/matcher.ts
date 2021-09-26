import deepClone from 'lodash.clonedeep';
import Queue from '../util/Queue';

import { DataItemKey } from '../type';

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
    // TODO: 判断是否是数组
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
    // NOTE: 处理顺序：增加数据-删除数据-修改 value - 修改 key
    if (!this.addRecord.isEmpty()) {
      this.addRecord.forEach((record) => {
        result[record['key']] = record['valueFn'](originalDataItem);
      });
    }
    if (!this.deleteRecord.isEmpty()) {
      this.deleteRecord.forEach((record) => {
        record.forEach((key: string) => {
          delete result[key];
        });
      });
    }
    if (!this.editValueRecord.isEmpty()) {
      this.editValueRecord.forEach((record) => {
        const cloneValue =
          typeof result[record['key']] === 'object'
            ? deepClone(result[record['key']])
            : result[record['key']];
        console.log('--cloneValue', cloneValue);
        result[record['key']] = record['valueFn'](cloneValue, originalDataItem);
      });
    }

    if (!this.editKeyRecord.isEmpty()) {
      this.editKeyRecord.forEach((records) => {
        // FIXME: 判断是否存在
        records.forEach((record: any) => {
          const cloneValue =
            typeof result[record['key']] === 'object'
              ? deepClone(result[record['key']])
              : result[record['key']];
          result[record['newKey']] = cloneValue;
          delete result[record['key']];
        });
      });
    }
    return result;
  }

  public add(key: string, valueFn: (data: any) => any) {
    const record = { key, valueFn };
    this.addRecord.enqueue(record);
    return this;
  }

  public delete(keys: string[]) {
    this.deleteRecord.enqueue(keys);
    return this;
  }

  public editValue(key: string, valueFn: (data: any) => any) {
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