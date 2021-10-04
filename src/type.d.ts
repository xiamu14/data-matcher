export type DataItemKey = string | symbol;
export type DataItem = Record<DataItemKey, any>;
export type DataType = DataItem | DataItem[];
export type MayBeInvalidType = null | undefined | '' | 'null' | 'undefined' | 0;
