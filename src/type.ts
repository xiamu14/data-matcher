export type DataItemKey = string | symbol | number;
export type DataItem = Record<DataItemKey, unknown>;
export type DataType<T extends DataItem> = T | T[];
export type MayBeInvalidType = null | undefined | '' | 'null' | 'undefined' | 0;
