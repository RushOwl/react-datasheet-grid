import React from 'react';
export declare type ColumnWidth = string | number;
export declare type Cell = {
    col: number;
    row: number;
};
export declare type Selection = {
    min: Cell;
    max: Cell;
};
export declare type CellProps<T, C> = {
    rowData: T;
    rowIndex: number;
    columnIndex: number;
    active: boolean;
    focus: boolean;
    disabled: boolean;
    columnData: C;
    setRowData: (rowData: T) => void;
    stopEditing: (opts?: {
        nextRow: boolean;
    }) => void;
    insertRowBelow: () => void;
    duplicateRow: () => void;
    deleteRow: () => void;
    getContextMenuItems: () => ContextMenuItem[];
};
export declare type CellComponent<T, C> = (props: CellProps<T, C>) => JSX.Element;
export declare type Column<T, C> = {
    id?: string;
    headerClassName?: string;
    title?: React.ReactNode;
    width: ColumnWidth;
    minWidth: number;
    maxWidth?: number;
    renderWhenScrolling: boolean;
    component: CellComponent<T, C>;
    columnData?: C;
    disableKeys: boolean;
    disabled: boolean | ((opt: {
        rowData: T;
        rowIndex: number;
    }) => boolean);
    cellClassName?: string | ((opt: {
        rowData: T;
        rowIndex: number;
    }) => string | undefined);
    keepFocus: boolean;
    deleteValue: (opt: {
        rowData: T;
        rowIndex: number;
    }) => T;
    copyValue: (opt: {
        rowData: T;
        rowIndex: number;
    }) => number | string | null;
    pasteValue: (opt: {
        rowData: T;
        value: string;
        rowIndex: number;
    }) => T;
    isCellEmpty: (opt: {
        rowData: T;
        rowIndex: number;
    }) => boolean;
};
export declare type ListItemData<T> = {
    data: T[];
    contentWidth?: number;
    columns: Column<T, any>[];
    hasStickyRightColumn: boolean;
    activeCell: Cell | null;
    selectionMinRow?: number;
    selectionMaxRow?: number;
    editing: boolean;
    setRowData: (rowIndex: number, item: T) => void;
    deleteRows: (rowMin: number, rowMax?: number) => void;
    duplicateRows: (rowMin: number, rowMax?: number) => void;
    insertRowAfter: (row: number, count?: number) => void;
    stopEditing: (opts?: {
        nextRow?: boolean;
    }) => void;
    getContextMenuItems: () => ContextMenuItem[];
};
export declare type HeaderContextType<T> = {
    columns: Column<T, any>[];
    contentWidth?: number;
    hasStickyRightColumn: boolean;
    height: number;
    activeColMin?: number;
    activeColMax?: number;
};
export declare type SelectionContextType = {
    columnRights?: number[];
    columnWidths?: number[];
    activeCell: Cell | null;
    selection: Selection | null;
    dataLength: number;
    rowHeight: number;
    hasStickyRightColumn: boolean;
    editing: boolean;
    isCellDisabled: (cell: Cell) => boolean;
    headerRowHeight: number;
    viewWidth?: number;
    viewHeight?: number;
    contentWidth?: number;
    edges: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    expandSelection: number | null;
};
export declare type RowProps<T> = {
    index: number;
    data: T;
    style: React.CSSProperties;
    isScrolling?: boolean;
    columns: Column<T, any>[];
    hasStickyRightColumn: boolean;
    active: boolean;
    activeColIndex: number | null;
    editing: boolean;
    setRowData: (rowIndex: number, item: T) => void;
    deleteRows: (rowMin: number, rowMax?: number) => void;
    duplicateRows: (rowMin: number, rowMax?: number) => void;
    insertRowAfter: (row: number, count?: number) => void;
    stopEditing?: (opts?: {
        nextRow?: boolean;
    }) => void;
    getContextMenuItems: () => ContextMenuItem[];
};
export declare type SimpleColumn<T, C> = Partial<Pick<Column<T, C>, 'title' | 'maxWidth' | 'minWidth' | 'width' | 'component' | 'columnData'>>;
export declare type AddRowsComponentProps = {
    addRows: (count?: number) => void;
};
export declare type ContextMenuItem = {
    type: 'INSERT_ROW_BELLOW' | 'DELETE_ROW' | 'DUPLICATE_ROW';
    action: () => void;
} | {
    type: 'DELETE_ROWS' | 'DUPLICATE_ROWS';
    action: () => void;
    fromRow: number;
    toRow: number;
};
export declare type ContextMenuComponentProps = {
    clientX: number;
    clientY: number;
    items: ContextMenuItem[];
    close: () => void;
};
export declare type DataSheetGridProps<T> = {
    value?: T[];
    style?: React.CSSProperties;
    className?: string;
    onChange?: (value: T[]) => void;
    columns?: Partial<Column<T, any>>[];
    gutterColumn?: SimpleColumn<T, any>;
    stickyRightColumn?: SimpleColumn<T, any>;
    height?: number;
    rowHeight?: number;
    headerRowHeight?: number;
    addRowsComponent?: (props: AddRowsComponentProps) => JSX.Element;
    createRow?: () => T;
    duplicateRow?: (opts: {
        rowData: T;
        rowIndex: number;
    }) => T;
    autoAddRow?: boolean;
    lockRows?: boolean;
    disableContextMenu?: boolean;
    disableExpandSelection?: boolean;
    contextMenuComponent?: (props: ContextMenuComponentProps) => JSX.Element;
    onFocus?: (opts: {
        cell: CellWithId;
    }) => void;
    onBlur?: (opts: {
        cell: CellWithId;
    }) => void;
    onActiveCellChange?: (opts: {
        cell: CellWithId | null;
    }) => void;
    onSelectionChange?: (opts: {
        selection: SelectionWithId | null;
    }) => void;
};
declare type CellWithIdInput = {
    col: number | string;
    row: number;
};
declare type SelectionWithIdInput = {
    min: CellWithIdInput;
    max: CellWithIdInput;
};
export declare type CellWithId = {
    colId?: string;
    col: number;
    row: number;
};
export declare type SelectionWithId = {
    min: CellWithId;
    max: CellWithId;
};
export declare type DataSheetGridRef = {
    activeCell: CellWithId | null;
    selection: SelectionWithId | null;
    setActiveCell: (activeCell: CellWithIdInput | null) => void;
    setSelection: (selection: SelectionWithIdInput | null) => void;
};
export {};
//# sourceMappingURL=types.d.ts.map