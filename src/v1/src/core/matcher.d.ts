import { DataItemKey } from '../type';
declare class Matcher {
    private addRecord;
    private deleteRecord;
    private editValueRecord;
    private editKeyRecord;
    private originalData;
    private result;
    constructor(data: any);
    get data(): any;
    shouldConvert(): boolean;
    private convert;
    private convertItem;
    add(key: string, valueFn: (data: any) => any): this;
    delete(keys: string[]): this;
    editValue(key: string, valueFn: (data: any) => any): this;
    editKey(keyMap: Record<DataItemKey, DataItemKey>): this;
}
export default Matcher;
