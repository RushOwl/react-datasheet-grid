import { Column } from '../types';
declare type ColumnData = {
    key: string;
    original: Partial<Column<any, any>>;
};
export declare const keyColumn: <T extends Record<string, any>, K extends keyof T = keyof T>(key: K, column: Partial<Column<T[K], any>>) => Partial<Column<T, ColumnData>>;
export {};
//# sourceMappingURL=keyColumn.d.ts.map