var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { areEqual } from 'react-window';
import React, { useCallback } from 'react';
import cx from 'classnames';
import { Cell } from './Cell';
import { useFirstRender } from '../hooks/useFirstRender';
const nullfunc = () => null;
const RowComponent = React.memo(({ index, style, data, isScrolling, columns, hasStickyRightColumn, active, activeColIndex, editing, setRowData, deleteRows, insertRowAfter, duplicateRows, stopEditing, getContextMenuItems, }) => {
    const firstRender = useFirstRender();
    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender;
    const setGivenRowData = useCallback((rowData) => {
        setRowData(index, rowData);
    }, [index, setRowData]);
    const deleteGivenRow = useCallback(() => {
        deleteRows(index);
    }, [deleteRows, index]);
    const duplicateGivenRow = useCallback(() => {
        duplicateRows(index);
    }, [duplicateRows, index]);
    const insertAfterGivenRow = useCallback(() => {
        insertRowAfter(index);
    }, [insertRowAfter, index]);
    return (React.createElement("div", { className: "dsg-row", style: style }, columns.map((column, i) => {
        const Component = column.component;
        const disabled = column.disabled === true ||
            (typeof column.disabled === 'function' &&
                column.disabled({ rowData: data, rowIndex: index }));
        return (React.createElement(Cell, { key: i, gutter: i === 0, disabled: disabled, stickyRight: hasStickyRightColumn && i === columns.length - 1, column: column, active: active, className: cx(!column.renderWhenScrolling && renderLight && 'dsg-cell-light', typeof column.cellClassName === 'function'
                ? column.cellClassName({ rowData: data, rowIndex: index })
                : column.cellClassName) }, (column.renderWhenScrolling || !renderLight) && (React.createElement(Component, { rowData: data, getContextMenuItems: getContextMenuItems, disabled: disabled, active: activeColIndex === i - 1, columnIndex: i - 1, rowIndex: index, focus: activeColIndex === i - 1 && editing, deleteRow: deleteGivenRow, duplicateRow: duplicateGivenRow, stopEditing: activeColIndex === i - 1 && editing && stopEditing
                ? stopEditing
                : nullfunc, insertRowBelow: insertAfterGivenRow, setRowData: setGivenRowData, columnData: column.columnData }))));
    })));
}, (prevProps, nextProps) => {
    const { isScrolling: prevIsScrolling } = prevProps, prevRest = __rest(prevProps, ["isScrolling"]);
    const { isScrolling: nextIsScrolling } = nextProps, nextRest = __rest(nextProps
    // When we are scrolling always re-use previous render, otherwise check props
    , ["isScrolling"]);
    // When we are scrolling always re-use previous render, otherwise check props
    return nextIsScrolling || (!prevIsScrolling && areEqual(prevRest, nextRest));
});
RowComponent.displayName = 'RowComponent';
export const Row = ({ index, style, data, isScrolling, }) => {
    var _a, _b, _c, _d, _e;
    // Do not render header row, it is rendered by the InnerContainer
    if (index === 0) {
        return null;
    }
    return (React.createElement(RowComponent, { index: index - 1, data: data.data[index - 1], columns: data.columns, style: Object.assign(Object.assign({}, style), { width: data.contentWidth ? data.contentWidth : '100%' }), hasStickyRightColumn: data.hasStickyRightColumn, isScrolling: isScrolling, active: Boolean(index - 1 >= ((_a = data.selectionMinRow) !== null && _a !== void 0 ? _a : Infinity) &&
            index - 1 <= ((_b = data.selectionMaxRow) !== null && _b !== void 0 ? _b : -Infinity) &&
            data.activeCell), activeColIndex: ((_c = data.activeCell) === null || _c === void 0 ? void 0 : _c.row) === index - 1 ? data.activeCell.col : null, editing: Boolean(((_d = data.activeCell) === null || _d === void 0 ? void 0 : _d.row) === index - 1 && data.editing), setRowData: data.setRowData, deleteRows: data.deleteRows, insertRowAfter: data.insertRowAfter, duplicateRows: data.duplicateRows, stopEditing: ((_e = data.activeCell) === null || _e === void 0 ? void 0 : _e.row) === index - 1 && data.editing
            ? data.stopEditing
            : undefined, getContextMenuItems: data.getContextMenuItems }));
};
//# sourceMappingURL=Row.js.map