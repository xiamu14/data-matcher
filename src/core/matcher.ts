import deepClone from 'lodash.clonedeep';
import Queue from '../util/Queue';
import { DataItem, DataItemKey, DataType, MayBeInvalidType } from '../type';
import { isObject } from '../util/isType';

type AddRecord<T> = { key: DataItemKey; valueFn: (data: T) => any };
type DeleteRecord<T> = (keyof T)[];
type EditValueRecord<T> = {
  key: keyof T;
  valueFn: (value: any, data: T) => any;
};
type EditKeyRecord<T> = {
  key: keyof T;
  newKey?: DataItemKey;
  isReserve: boolean;
};
type CleanRecord = MayBeInvalidType[];
class Matcher<T extends DataItem> {
  private addRecord = new Queue<AddRecord<T>>();
  private deleteRecord = new Queue<DeleteRecord<T>>();
  private editValueRecord = new Queue<EditValueRecord<T>>();
  private editKeyRecord = new Queue<EditKeyRecord<T>[]>();
  private cleanRecord = new Queue<CleanRecord>();

  private noExitKeys = new Set<DataItemKey>(); // 存储不存在的 key，用于提示开发者修正带吗
  private originalData: any;
  private result: any;

  constructor(data: DataType<T>) {
    if (isObject(data) || Array.isArray(data)) {
      this.originalData = deepClone(data);
      this.result = deepClone(data);
    } else {
      throw new TypeError('The parameter must be an Object or Array.');
    }
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
      !this.editKeyRecord.isEmpty() ||
      !this.cleanRecord.isEmpty()
    );
  }

  private convert() {
    // NOTE: 判断是否是数组
    if (Array.isArray(this.originalData)) {
      this.result = this.originalData.map((item, index) => {
        const type =
          index === this.originalData.length - 1
            ? 'forEachOnce'
            : 'forEachAlways';
        return this.convertItem(item, type);
      });
    } else {
      this.result = this.convertItem(this.originalData, 'forEachOnce');
    }
    if (this.noExitKeys.size > 0) {
      let keyString = '';
      this.noExitKeys.forEach((item) => {
        keyString = `${keyString},${
          typeof item === 'symbol' ? String(item) : item
        }`;
      });
      console.warn(
        `key 错误： 以下 key [${keyString.substr(1)}] 不存在于数据中`,
      );
    }
  }

  private convertItem(
    originalDataItem: any,
    type: 'forEachOnce' | 'forEachAlways',
  ) {
    const result: any = deepClone(originalDataItem);

    // NOTE: 处理顺序：增加数据-删除数据-修改 value - 修改 key
    if (!this.addRecord.isEmpty()) {
      this.addRecord[type]((record) => {
        // NOTE: 判断不存在先
        if (!(record['key'] in result)) {
          result[record['key']] = record['valueFn'](originalDataItem);
        }
      });
    }

    if (!this.editValueRecord.isEmpty()) {
      this.editValueRecord[type]((record) => {
        const { key, valueFn } = record;
        if (key in result) {
          const cloneValue =
            typeof result[key] === 'object'
              ? deepClone(result[key])
              : result[key];
          // console.log('--cloneValue', cloneValue);
          result[key] = valueFn(cloneValue, originalDataItem);
        } else {
          this.noExitKeys.add(key);
        }
      });
    }

    if (!this.editKeyRecord.isEmpty()) {
      this.editKeyRecord[type]((records) => {
        records.forEach((record: any) => {
          const { key, newKey, isReserve } = record;
          if (key in result) {
            const cloneValue =
              typeof result[key] === 'object'
                ? deepClone(result[key])
                : result[key];
            result[newKey] = cloneValue;
            if (!isReserve) {
              delete result[key];
            }
          } else {
            this.noExitKeys.add(key);
          }
        });
      });
    }
    if (!this.deleteRecord.isEmpty()) {
      this.deleteRecord[type]((record) => {
        record.forEach((key: string) => {
          if (key in result) {
            delete result[key];
          } else {
            this.noExitKeys.add(key);
          }
        });
      });
    }
    if (!this.cleanRecord.isEmpty()) {
      this.cleanRecord[type]((record) => {
        Object.keys(result).forEach((key) => {
          if (record.includes(result[key])) delete result[key];
        });
      });
    }
    return result;
  }

  public add(key: DataItemKey, valueFn: (data: T) => any) {
    const record = { key, valueFn };
    this.addRecord.enqueue(record);
    return this;
  }

  public delete(keys: (keyof T)[]) {
    this.deleteRecord.enqueue(keys);
    return this;
  }

  public editValue(key: keyof T, valueFn: (value: any, data: T) => any) {
    const record = { key, valueFn };
    this.editValueRecord.enqueue(record);
    return this;
  }

  public editKey(keyMap: Partial<Record<keyof T, DataItemKey>>) {
    const records: EditKeyRecord<T>[] = [];
    Object.keys(keyMap).forEach((key) => {
      records.push({ key, newKey: keyMap[key], isReserve: false });
    });
    this.editKeyRecord.enqueue(records);
    return this;
  }

  public clone(keyMap: Partial<Record<keyof T, DataItemKey>>) {
    const records: EditKeyRecord<T>[] = [];
    Object.keys(keyMap).forEach((key) => {
      records.push({ key, newKey: keyMap[key], isReserve: true });
    });
    this.editKeyRecord.enqueue(records);
    return this;
  }

  public clean(invalidValues: MayBeInvalidType[]) {
    this.cleanRecord.enqueue(invalidValues);
    return this;
  }

  // marked: 组合方法

  public when(
    condition: boolean,
    whenTruthy: ((that: Matcher<T>) => void) | null,
    whenFalsy: ((that: Matcher<T>) => void) | null,
  ) {
    if (condition) {
      whenTruthy?.(this);
    } else {
      whenFalsy?.(this);
    }
    return this;
  }
}

export default Matcher;
