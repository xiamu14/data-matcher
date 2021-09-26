import { DataItem } from '../type';
export default class Queue {
    items: DataItem[];
    constructor();
    enqueue(item: DataItem): void;
    dequeue(): Record<string | number | symbol, any> | undefined;
    forEach(callback: (item: DataItem, index: number) => void): void;
    isEmpty(): boolean;
}
