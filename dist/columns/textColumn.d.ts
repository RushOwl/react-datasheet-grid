import { Column } from '../types';
declare type TextColumnOptions<T> = {
    placeholder?: string;
    alignRight?: boolean;
    continuousUpdates?: boolean;
    deletedValue?: T;
    parseUserInput?: (value: string) => T;
    formatBlurredInput?: (value: T) => string;
    formatInputOnFocus?: (value: T) => string;
    formatForCopy?: (value: T) => string;
    parsePastedValue?: (value: string) => T;
};
declare type TextColumnData<T> = {
    placeholder?: string;
    alignRight: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => T;
    formatBlurredInput: (value: T) => string;
    formatInputOnFocus: (value: T) => string;
};
export declare const textColumn: Partial<Column<string | null, TextColumnData<string | null>>>;
export declare function createTextColumn<T = string | null>({ placeholder, alignRight, continuousUpdates, deletedValue, parseUserInput, formatBlurredInput, formatInputOnFocus, formatForCopy, parsePastedValue, }?: TextColumnOptions<T>): Partial<Column<T, TextColumnData<T>>>;
export {};
//# sourceMappingURL=textColumn.d.ts.map