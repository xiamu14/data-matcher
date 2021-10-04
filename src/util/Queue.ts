export default class Queue<T> {
  items: T[];
  constructor() {
    this.items = [];
  }

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  // 暂未使用
  // peek() {
  //   return this.items[0];
  // }

  forEachOnce(callback: (item: T, index: number) => void) {
    let index = 0;
    const action = () => {
      if (!this.isEmpty()) {
        const item = this.dequeue() as T;
        callback(item, index);
        index += 1;
        action();
      }
    };
    action();
  }

  forEachAlways(callback: (item: T, index: number) => void) {
    this.items.forEach((item, index) => {
      callback(item, index);
    });
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
