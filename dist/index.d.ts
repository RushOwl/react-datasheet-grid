/// <reference types="react" />
import { Column as ColumnBase, CellComponent as CellComponentBase, CellProps as CellPropsBase, DataSheetGridProps as DataSheetGridPropsBase, AddRowsComponentProps as AddRowsComponentPropsBase, SimpleColumn as SimpleColumnBase, ContextMenuComponentProps as ContextMenuComponentPropsBase, ContextMenuItem as ContextMenuItemBase, DataSheetGridRef as DataSheetGridRefBase } from './types';
export declare type Column<T = any, C = any> = Partial<ColumnBase<T, C>>;
export declare type CellComponent<T = any, C = any> = CellComponentBase<T, C>;
export declare type CellProps<T = any, C = any> = CellPropsBase<T, C>;
export declare type DataSheetGridProps<T = any> = DataSheetGridPropsBase<T>;
export declare type AddRowsComponentProps = AddRowsComponentPropsBase;
export declare type SimpleColumn<T = any, C = any> = SimpleColumnBase<T, C>;
export declare type ContextMenuComponentProps = ContextMenuComponentPropsBase;
export declare type ContextMenuItem = ContextMenuItemBase;
export declare type DataSheetGridRef = DataSheetGridRefBase;
export declare const DynamicDataSheetGrid: <T extends unknown>(props: DataSheetGridPropsBase<T> & {
    ref?: import("react").ForwardedRef<DataSheetGridRefBase> | undefined;
}) => JSX.Element;
export declare const DataSheetGrid: <T extends unknown>(props: DataSheetGridPropsBase<T> & {
    ref?: import("react").ForwardedRef<DataSheetGridRefBase> | undefined;
}) => JSX.Element;
export { textColumn, createTextColumn } from './columns/textColumn';
export { checkboxColumn } from './columns/checkboxColumn';
export { floatColumn } from './columns/floatColumn';
export { intColumn } from './columns/intColumn';
export { percentColumn } from './columns/percentColumn';
export { dateColumn } from './columns/dateColumn';
export { keyColumn } from './columns/keyColumn';
//# sourceMappingURL=index.d.ts.map