import deepClone from 'lodash.clonedeep';
import Queue from '../util/Queue';
import { DataItem, DataItemKey, DataType, MayBeInvalidType } from '../type';
import { isNotEmptyArray, isObject } from '../util/isType';

type AddRecord<T> = { key: DataItemKey; valueFn: (data: T) => any };
type Keys<T> = (keyof T)[];
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
  private deleteRecord = new Queue<Keys<T>>();
  private pickRecord = new Queue<Keys<T>>();
  private editValueRecord = new Queue<EditValueRecord<T>>();
  private editKeyRecord = new Queue<EditKeyRecord<T>[]>();
  private cleanRecord = new Queue<CleanRecord>();

  private noExitKeys = new Set<DataItemKey>(); // 存储不存在的 key，用于提示开发者修正
  private originalData: DataType<T>;
  private result: any;

  constructor(data: DataType<T>) {
    if (isObject(data) || isNotEmptyArray<T>(data)) {
      this.originalData = deepClone(data) as DataType<T>;
      this.result = deepClone(data);
    } else {
      throw new TypeError(
        'The dataSet must be an Object or Array,and cannot be an empty object or empty array.',
      );
    }
  }

  // NOTE: 获取原始数据
  public getOrigin() {
    return this.originalData;
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
      !this.pickRecord.isEmpty() ||
      !this.editValueRecord.isEmpty() ||
      !this.editKeyRecord.isEmpty() ||
      !this.cleanRecord.isEmpty()
    );
  }

  private getOriginKeys() {
    // 对比当前的 deleteRecord
    let originKeys: string[] = [];

    if (Array.isArray(this.originalData)) {
      originKeys = Object.keys(this.originalData[0]);
    } else {
      originKeys = Object.keys(this.originalData);
    }
    return originKeys;
  }

  private addNoExitKey(key: DataItemKey) {
    this.noExitKeys.add(typeof key === 'symbol' ? String(key) : key);
  }

  private convert() {
    // NOTE: 判断是否是数组
    if (Array.isArray(this.originalData)) {
      this.result = this.originalData.map((item, index) => {
        // NOTE: 当是最后一条数据时，使用 forEachOnce ，来清除记录，从而不重复计算
        const type =
          index === (this.originalData as T[]).length - 1
            ? 'forEachOnce'
            : 'forEachAlways';
        return this.convertItem(item, type);
      });
    } else {
      this.result = this.convertItem(this.originalData, 'forEachOnce');
    }
    if (this.noExitKeys.size > 0) {
      console.warn(
        `[warn]:Fields of ${[...this.noExitKeys].join(',')} do not exist.`,
      );
    }
  }

  // NOTE: 根据 deleteRecord 和 pickRecord 判断哪些字段需要删除；pick 优先级大于 delete
  private pickOrDelete(result: any, type: 'forEachOnce' | 'forEachAlways') {
    if (!this.pickRecord.isEmpty()) {
      let pickKeys: string[] = [];
      this.pickRecord[type]((record) => {
        pickKeys = pickKeys.concat(record as string[]);
      });
      const originKeys = this.getOriginKeys();
      const editKeys = Object.keys(result);
      const needDeleteKeys = originKeys
        .filter((it) => editKeys.includes(it)) // 过滤掉 add 函数新增的字段
        .filter((it) => !pickKeys.includes(it));
      needDeleteKeys.forEach((key: string) => {
        if (key in result) {
          delete result[key];
        } else {
          this.addNoExitKey(key);
        }
      });
      if (!this.deleteRecord.isEmpty()) {
        console.warn(
          '[warn]:Function "pick" has already been called, function "delete" will have no effect.',
        );
      }
    } else if (!this.deleteRecord.isEmpty()) {
      let deleteKeys: string[] = [];
      this.deleteRecord[type]((record) => {
        deleteKeys = deleteKeys.concat(record as string[]);
      });
      deleteKeys.forEach((key: string) => {
        if (key in result) {
          delete result[key];
        } else {
          this.addNoExitKey(key);
        }
      });
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

    this.pickOrDelete(result, type);

    if (!this.editValueRecord.isEmpty()) {
      this.editValueRecord[type]((record) => {
        const { key, valueFn } = record;
        if (key in result) {
          const cloneValue =
            typeof result[key] === 'object'
              ? deepClone(result[key])
              : result[key];
          result[key] = valueFn(cloneValue, originalDataItem);
        } else {
          this.addNoExitKey(key);
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
            this.addNoExitKey(key);
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

  // NOTE: pick 优先级 > delete ；并提示冲突
  public pick(keys: (keyof T)[]) {
    this.pickRecord.enqueue(keys);
    return this;
  }

  public delete(keys: (keyof T)[]) {
    // NOTE: 这里估计没考虑过 symbol
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
