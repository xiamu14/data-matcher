import { DataItem } from '../type';

export default class Queue {
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

  // 暂未使用
  // peek() {
  //   return this.items[0];
  // }

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
