var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { VariableSizeList } from 'react-window';
// import '../style.css'
import { Row } from './Row';
import { useColumnWidths } from '../hooks/useColumnWidths';
import { useResizeDetector } from 'react-resize-detector';
import { InnerContainer } from './InnerContainer';
import { HeaderContext } from '../contexts/HeaderContext';
import { useColumns } from '../hooks/useColumns';
import { useMemoObject } from '../hooks/useMemoObject';
import { SelectionContext } from '../contexts/SelectionContext';
import { useEdges } from '../hooks/useEdges';
import { useDeepEqualState } from '../hooks/useDeepEqualState';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
import { useGetBoundingClientRect } from '../hooks/useGetBoundingClientRect';
import { AddRows } from './AddRows';
import { useDebounceState } from '../hooks/useDebounceState';
import deepEqual from 'fast-deep-equal';
import { ContextMenu } from './ContextMenu';
import { parseTextPlainData, parseTextHtmlData } from '../utils/copyPasting';
import { getCell, getCellWithId, getSelection, getSelectionWithId, } from '../utils/typeCheck';
import { encode as encodeHtml } from 'html-entities';
import { getAllTabbableElements } from '../utils/tab';
const DEFAULT_DATA = [];
const DEFAULT_COLUMNS = [];
const DEFAULT_CREATE_ROW = () => ({});
const DEFAULT_EMPTY_CALLBACK = () => null;
const DEFAULT_DUPLICATE_ROW = ({ rowData, }) => (Object.assign({}, rowData));
// eslint-disable-next-line react/display-name
export const DataSheetGrid = React.memo(React.forwardRef(({ 
// Data is deprecated but still supported, value should be used instead
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
data: deprecatedValue, value: data = deprecatedValue !== null && deprecatedValue !== void 0 ? deprecatedValue : DEFAULT_DATA, className, style, height: maxHeight = 400, onChange = DEFAULT_EMPTY_CALLBACK, columns: rawColumns = DEFAULT_COLUMNS, rowHeight = 40, headerRowHeight = rowHeight, gutterColumn, stickyRightColumn, addRowsComponent: AddRowsComponent = AddRows, createRow = DEFAULT_CREATE_ROW, autoAddRow = false, lockRows = false, disableExpandSelection = false, duplicateRow = DEFAULT_DUPLICATE_ROW, contextMenuComponent: ContextMenuComponent = ContextMenu, disableContextMenu: disableContextMenuRaw = false, onFocus = DEFAULT_EMPTY_CALLBACK, onBlur = DEFAULT_EMPTY_CALLBACK, onActiveCellChange = DEFAULT_EMPTY_CALLBACK, onSelectionChange = DEFAULT_EMPTY_CALLBACK, }, ref) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Display a warning message message when `data` is used instead of `value`
    useMemo(() => {
        if (deprecatedValue !== undefined) {
            console.warn('Property `data` of <DataSheetGrid /> is deprecated, please use `value` instead.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const lastEditingCellRef = useRef(null);
    const disableContextMenu = disableContextMenuRaw || lockRows;
    const columns = useColumns(rawColumns, gutterColumn, stickyRightColumn);
    const hasStickyRightColumn = Boolean(stickyRightColumn);
    const listRef = useRef(null);
    const innerRef = useRef(null);
    const outerRef = useRef(null);
    const beforeTabIndexRef = useRef(null);
    const afterTabIndexRef = useRef(null);
    useEffect(() => {
        var _a;
        (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.resetAfterIndex(0);
    }, [headerRowHeight, rowHeight]);
    // Default value is 1 for the border
    const [heightDiff, setHeightDiff] = useDebounceState(1, 100);
    // Height of the list (including scrollbars and borders) to display
    const displayHeight = Math.min(maxHeight, headerRowHeight + data.length * rowHeight + heightDiff);
    // Width and height of the scrollable area
    const { width, height } = useResizeDetector({
        targetRef: outerRef,
        refreshMode: 'throttle',
        refreshRate: 100,
    });
    setHeightDiff(height ? displayHeight - height : 0);
    const edges = useEdges(outerRef, width, height);
    const { fullWidth, totalWidth: contentWidth, columnWidths, columnRights, } = useColumnWidths(columns, width);
    // x,y coordinates of the right click
    const [contextMenu, setContextMenu] = useState(null);
    // Items of the context menu
    const [contextMenuItems, setContextMenuItems] = useState([]);
    // True when the active cell is being edited
    const [editing, setEditing] = useState(false);
    // Number of rows the user is expanding the selection by, always a number, even when not expanding selection
    const [expandSelectionRowsCount, setExpandSelectionRowsCount] = useState(0);
    // When not null, represents the index of the row from which we are expanding
    const [expandingSelectionFromRowIndex, setExpandingSelectionFromRowIndex,] = useState(null);
    // Highlighted cell, null when not focused
    const [activeCell, setActiveCell] = useDeepEqualState(null);
    // The selection cell and the active cell are the two corners of the selection, null when nothing is selected
    const [selectionCell, setSelectionCell] = useDeepEqualState(null);
    // Min and max of the current selection (rectangle defined by the active cell and the selection cell), null when nothing is selected
    const selection = useMemo(() => activeCell &&
        selectionCell && {
        min: {
            col: Math.min(activeCell.col, selectionCell.col),
            row: Math.min(activeCell.row, selectionCell.row),
        },
        max: {
            col: Math.max(activeCell.col, selectionCell.col),
            row: Math.max(activeCell.row, selectionCell.row),
        },
    }, [activeCell, selectionCell]);
    // Behavior of the selection when the user drags the mouse around
    const [selectionMode, setSelectionMode] = useDeepEqualState({
        // True when the position of the cursor should impact the columns of the selection
        columns: false,
        // True when the position of the cursor should impact the rows of the selection
        rows: false,
        // True when the user is dragging the mouse around to select
        active: false,
    });
    // Same as expandSelectionRowsCount but is null when we should not be able to expand the selection
    const expandSelection = disableExpandSelection ||
        editing ||
        selectionMode.active ||
        (activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) === (data === null || data === void 0 ? void 0 : data.length) - 1 ||
        (selection === null || selection === void 0 ? void 0 : selection.max.row) === (data === null || data === void 0 ? void 0 : data.length) - 1 ||
        (activeCell &&
            columns
                .slice(((_a = selection === null || selection === void 0 ? void 0 : selection.min.col) !== null && _a !== void 0 ? _a : activeCell.col) + 1, ((_b = selection === null || selection === void 0 ? void 0 : selection.max.col) !== null && _b !== void 0 ? _b : activeCell.col) + 2)
                .every((column) => column.disabled === true))
        ? null
        : expandSelectionRowsCount;
    const getInnerBoundingClientRect = useGetBoundingClientRect(innerRef);
    const getOuterBoundingClientRect = useGetBoundingClientRect(outerRef);
    // Blur any element on focusing the grid
    useEffect(() => {
        var _a;
        if (activeCell !== null) {
            ;
            document.activeElement.blur();
            (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCell !== null]);
    // Extract the coordinates of the cursor from a mouse event
    const getCursorIndex = useCallback((event, force = false, includeSticky = false) => {
        const innerBoundingClientRect = getInnerBoundingClientRect(force);
        const outerBoundingClientRect = includeSticky && getOuterBoundingClientRect(force);
        if (innerBoundingClientRect && columnRights && columnWidths) {
            let x = event.clientX - innerBoundingClientRect.left;
            let y = event.clientY - innerBoundingClientRect.top;
            if (outerBoundingClientRect) {
                if (event.clientY - outerBoundingClientRect.top <=
                    headerRowHeight) {
                    y = 0;
                }
                if (event.clientX - outerBoundingClientRect.left <=
                    columnWidths[0]) {
                    x = 0;
                }
                if (hasStickyRightColumn &&
                    outerBoundingClientRect.right - event.clientX <=
                        columnWidths[columnWidths.length - 1]) {
                    x = columnRights[columnRights.length - 2] + 1;
                }
            }
            return {
                col: columnRights.findIndex((right) => x < right) - 1,
                row: Math.min(data.length - 1, Math.max(-1, Math.floor((y - headerRowHeight) / rowHeight))),
            };
        }
        return null;
    }, [
        columnRights,
        columnWidths,
        data.length,
        getInnerBoundingClientRect,
        getOuterBoundingClientRect,
        headerRowHeight,
        rowHeight,
        hasStickyRightColumn,
    ]);
    const dataRef = useRef(data);
    dataRef.current = data;
    const isCellDisabled = useCallback((cell) => {
        const disabled = columns[cell.col + 1].disabled;
        return Boolean(typeof disabled === 'function'
            ? disabled({
                rowData: dataRef.current[cell.row],
                rowIndex: cell.row,
            })
            : disabled);
    }, [columns]);
    const insertRowAfter = useCallback((row, count = 1) => {
        if (lockRows) {
            return;
        }
        setSelectionCell(null);
        setEditing(false);
        onChange([
            ...dataRef.current.slice(0, row + 1),
            ...new Array(count).fill(0).map(createRow),
            ...dataRef.current.slice(row + 1),
        ]);
        setActiveCell((a) => ({ col: (a === null || a === void 0 ? void 0 : a.col) || 0, row: row + count }));
    }, [createRow, lockRows, onChange, setActiveCell, setSelectionCell]);
    const duplicateRows = useCallback((rowMin, rowMax = rowMin) => {
        if (lockRows) {
            return;
        }
        onChange([
            ...dataRef.current.slice(0, rowMax + 1),
            ...dataRef.current
                .slice(rowMin, rowMax + 1)
                .map((rowData, i) => duplicateRow({ rowData, rowIndex: i + rowMin })),
            ...dataRef.current.slice(rowMax + 1),
        ]);
        setActiveCell({ col: 0, row: rowMax + 1 });
        setSelectionCell({
            col: columns.length - (hasStickyRightColumn ? 3 : 2),
            row: 2 * rowMax - rowMin + 1,
        });
        setEditing(false);
    }, [
        columns.length,
        duplicateRow,
        lockRows,
        onChange,
        setActiveCell,
        setSelectionCell,
        hasStickyRightColumn,
    ]);
    // Scroll to any given cell making sure it is in view
    const scrollTo = useCallback((cell) => {
        var _a, _b, _c;
        if (!height || !width) {
            return;
        }
        // Align top
        const topMax = cell.row * rowHeight;
        // Align bottom
        const topMin = (cell.row + 1) * rowHeight + headerRowHeight - height + 1;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const scrollTop = (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.state.scrollOffset;
        if (scrollTop > topMax) {
            (_b = listRef.current) === null || _b === void 0 ? void 0 : _b.scrollTo(topMax);
        }
        else if (scrollTop < topMin) {
            (_c = listRef.current) === null || _c === void 0 ? void 0 : _c.scrollTo(topMin);
        }
        if (columnRights && columnWidths && outerRef.current) {
            // Align left
            const leftMax = columnRights[cell.col] - columnRights[0];
            // Align right
            const leftMin = columnRights[cell.col] +
                columnWidths[cell.col + 1] +
                (hasStickyRightColumn
                    ? columnWidths[columnWidths.length - 1]
                    : 0) -
                width +
                1;
            const scrollLeft = outerRef.current.scrollLeft;
            if (scrollLeft > leftMax) {
                outerRef.current.scrollLeft = leftMax;
            }
            else if (scrollLeft < leftMin) {
                outerRef.current.scrollLeft = leftMin;
            }
        }
    }, [
        height,
        width,
        rowHeight,
        headerRowHeight,
        columnRights,
        columnWidths,
        hasStickyRightColumn,
    ]);
    // Scroll to the selectionCell cell when it changes
    useEffect(() => {
        if (selectionCell) {
            scrollTo(selectionCell);
        }
    }, [selectionCell, scrollTo]);
    // Scroll to the active cell when it changes
    useEffect(() => {
        if (activeCell) {
            scrollTo(activeCell);
        }
    }, [activeCell, scrollTo]);
    const setRowData = useCallback((rowIndex, item) => {
        var _a, _b;
        onChange([
            ...(_a = dataRef.current) === null || _a === void 0 ? void 0 : _a.slice(0, rowIndex),
            item,
            ...(_b = dataRef.current) === null || _b === void 0 ? void 0 : _b.slice(rowIndex + 1),
        ]);
    }, [onChange]);
    const deleteRows = useCallback((rowMin, rowMax = rowMin) => {
        if (lockRows) {
            return;
        }
        setEditing(false);
        setActiveCell((a) => {
            const row = Math.min(dataRef.current.length - 2 - rowMax + rowMin, rowMin);
            if (row < 0) {
                return null;
            }
            return a && Object.assign(Object.assign({}, a), { row });
        });
        setSelectionCell(null);
        onChange([
            ...dataRef.current.slice(0, rowMin),
            ...dataRef.current.slice(rowMax + 1),
        ]);
    }, [lockRows, onChange, setActiveCell, setSelectionCell]);
    const deleteSelection = useCallback((smartDelete = true) => {
        if (!activeCell) {
            return;
        }
        const min = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
        const max = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
        if (data
            .slice(min.row, max.row + 1)
            .every((rowData, i) => columns.every((column) => column.isCellEmpty({ rowData, rowIndex: i + min.row })))) {
            if (smartDelete) {
                deleteRows(min.row, max.row);
            }
            return;
        }
        const newData = [...data];
        for (let row = min.row; row <= max.row; ++row) {
            for (let col = min.col; col <= max.col; ++col) {
                if (!isCellDisabled({ col, row })) {
                    const { deleteValue = ({ rowData }) => rowData } = columns[col + 1];
                    newData[row] = deleteValue({
                        rowData: newData[row],
                        rowIndex: row,
                    });
                }
            }
        }
        if (smartDelete && deepEqual(newData, data)) {
            setActiveCell({ col: 0, row: min.row });
            setSelectionCell({
                col: columns.length - (hasStickyRightColumn ? 3 : 2),
                row: max.row,
            });
            return;
        }
        onChange(newData);
    }, [
        activeCell,
        columns,
        data,
        deleteRows,
        isCellDisabled,
        onChange,
        selection === null || selection === void 0 ? void 0 : selection.max,
        selection === null || selection === void 0 ? void 0 : selection.min,
        setActiveCell,
        setSelectionCell,
        hasStickyRightColumn,
    ]);
    const stopEditing = useCallback(({ nextRow = true } = {}) => {
        if ((activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) === dataRef.current.length - 1) {
            if (nextRow && autoAddRow) {
                insertRowAfter(activeCell.row);
            }
            else {
                setEditing(false);
            }
        }
        else {
            setEditing(false);
            if (nextRow) {
                setActiveCell((a) => a && Object.assign(Object.assign({}, a), { row: a.row + 1 }));
            }
        }
    }, [activeCell === null || activeCell === void 0 ? void 0 : activeCell.row, autoAddRow, insertRowAfter, setActiveCell]);
    const onCopy = useCallback((event) => {
        var _a, _b;
        if (!editing && activeCell) {
            const copyData = [];
            const min = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
            const max = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
            for (let row = min.row; row <= max.row; ++row) {
                copyData.push([]);
                for (let col = min.col; col <= max.col; ++col) {
                    const { copyValue = () => null } = columns[col + 1];
                    copyData[row - min.row].push(copyValue({ rowData: data[row], rowIndex: row }));
                }
            }
            (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.setData('text/plain', copyData.map((row) => row.join('\t')).join('\n'));
            (_b = event.clipboardData) === null || _b === void 0 ? void 0 : _b.setData('text/html', `<table>${copyData
                .map((row) => `<tr>${row
                .map((cell) => `<td>${encodeHtml(String(cell !== null && cell !== void 0 ? cell : '')).replace(/\n/g, '<br/>')}</td>`)
                .join('')}</tr>`)
                .join('')}</table>`);
            event.preventDefault();
        }
    }, [activeCell, columns, data, editing, selection]);
    useDocumentEventListener('copy', onCopy);
    const onCut = useCallback((event) => {
        if (!editing && activeCell) {
            onCopy(event);
            deleteSelection(false);
            event.preventDefault();
        }
    }, [activeCell, deleteSelection, editing, onCopy]);
    useDocumentEventListener('cut', onCut);
    const onPaste = useCallback((event) => __awaiter(void 0, void 0, void 0, function* () {
        var _l, _m, _o, _p, _q, _r, _s, _t;
        if (!editing && activeCell) {
            let pasteData = [['']];
            if ((_l = event.clipboardData) === null || _l === void 0 ? void 0 : _l.types.includes('text/html')) {
                pasteData = parseTextHtmlData((_m = event.clipboardData) === null || _m === void 0 ? void 0 : _m.getData('text/html'));
            }
            else if ((_o = event.clipboardData) === null || _o === void 0 ? void 0 : _o.types.includes('text/plain')) {
                pasteData = parseTextPlainData((_p = event.clipboardData) === null || _p === void 0 ? void 0 : _p.getData('text/plain'));
            }
            else if ((_q = event.clipboardData) === null || _q === void 0 ? void 0 : _q.types.includes('text')) {
                pasteData = parseTextPlainData((_r = event.clipboardData) === null || _r === void 0 ? void 0 : _r.getData('text'));
            }
            const min = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
            const max = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
            // Paste single row
            if (pasteData.length === 1) {
                const newData = [...data];
                for (let columnIndex = 0; columnIndex < pasteData[0].length; columnIndex++) {
                    const pasteValue = (_s = columns[min.col + columnIndex + 1]) === null || _s === void 0 ? void 0 : _s.pasteValue;
                    if (pasteValue) {
                        for (let rowIndex = min.row; rowIndex <= max.row; rowIndex++) {
                            if (!isCellDisabled({
                                col: columnIndex + min.col,
                                row: rowIndex,
                            })) {
                                newData[rowIndex] = yield pasteValue({
                                    rowData: newData[rowIndex],
                                    value: pasteData[0][columnIndex],
                                    rowIndex,
                                });
                            }
                        }
                    }
                }
                onChange(newData);
                setActiveCell({ col: min.col, row: min.row });
                setSelectionCell({
                    col: min.col + pasteData[0].length - 1,
                    row: max.row,
                });
            }
            else {
                // Paste multiple rows
                let newData = [...data];
                const missingRows = min.row + pasteData.length - data.length;
                if (missingRows > 0) {
                    if (!lockRows) {
                        newData = [
                            ...newData,
                            ...new Array(missingRows).fill(0).map(() => createRow()),
                        ];
                    }
                    else {
                        pasteData.splice(pasteData.length - missingRows, missingRows);
                    }
                }
                for (let columnIndex = 0; columnIndex < pasteData[0].length &&
                    min.col + columnIndex <
                        columns.length - (hasStickyRightColumn ? 2 : 1); columnIndex++) {
                    const pasteValue = (_t = columns[min.col + columnIndex + 1]) === null || _t === void 0 ? void 0 : _t.pasteValue;
                    if (pasteValue) {
                        for (let rowIndex = 0; rowIndex < pasteData.length; rowIndex++) {
                            if (!isCellDisabled({
                                col: min.col + columnIndex,
                                row: min.row + rowIndex,
                            })) {
                                newData[min.row + rowIndex] = yield pasteValue({
                                    rowData: newData[min.row + rowIndex],
                                    value: pasteData[rowIndex][columnIndex],
                                    rowIndex: min.row + rowIndex,
                                });
                            }
                        }
                    }
                }
                onChange(newData);
                setActiveCell({ col: min.col, row: min.row });
                setSelectionCell({
                    col: Math.min(min.col + pasteData[0].length - 1, columns.length - (hasStickyRightColumn ? 3 : 2)),
                    row: min.row + pasteData.length - 1,
                });
            }
            event.preventDefault();
        }
    }), [
        activeCell,
        columns,
        createRow,
        data,
        editing,
        hasStickyRightColumn,
        isCellDisabled,
        lockRows,
        onChange,
        selection === null || selection === void 0 ? void 0 : selection.max,
        selection === null || selection === void 0 ? void 0 : selection.min,
        setActiveCell,
        setSelectionCell,
    ]);
    useDocumentEventListener('paste', onPaste);
    const onMouseDown = useCallback((event) => {
        var _a, _b, _c;
        if (contextMenu && contextMenuItems.length) {
            return;
        }
        const rightClick = event.button === 2;
        const clickInside = ((_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) || false;
        const cursorIndex = clickInside
            ? getCursorIndex(event, true, true)
            : null;
        if (!clickInside &&
            editing &&
            activeCell &&
            columns[activeCell.col + 1].keepFocus) {
            return;
        }
        if (event.target instanceof HTMLElement &&
            event.target.className.includes('dsg-expand-rows-indicator')) {
            setExpandingSelectionFromRowIndex(Math.max((_b = activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== null && _b !== void 0 ? _b : 0, (_c = selection === null || selection === void 0 ? void 0 : selection.max.row) !== null && _c !== void 0 ? _c : 0));
            return;
        }
        const clickOnActiveCell = cursorIndex &&
            activeCell &&
            activeCell.col === cursorIndex.col &&
            activeCell.row === cursorIndex.row &&
            !isCellDisabled(activeCell);
        if (clickOnActiveCell && editing) {
            return;
        }
        const clickOnStickyRightColumn = (cursorIndex === null || cursorIndex === void 0 ? void 0 : cursorIndex.col) === columns.length - 2 && hasStickyRightColumn;
        const rightClickInSelection = rightClick &&
            selection &&
            cursorIndex &&
            cursorIndex.row >= selection.min.row &&
            cursorIndex.row <= selection.max.row &&
            cursorIndex.col >= selection.min.col &&
            cursorIndex.col <= selection.max.col;
        const rightClickOnSelectedHeaders = rightClick &&
            selection &&
            cursorIndex &&
            cursorIndex.row === -1 &&
            cursorIndex.col >= selection.min.col &&
            cursorIndex.col <= selection.max.col;
        const rightClickOnSelectedGutter = rightClick &&
            selection &&
            cursorIndex &&
            cursorIndex.row >= selection.min.row &&
            cursorIndex.row <= selection.max.row &&
            cursorIndex.col === -1;
        const clickOnSelectedStickyRightColumn = clickOnStickyRightColumn &&
            selection &&
            cursorIndex &&
            cursorIndex.row >= selection.min.row &&
            cursorIndex.row <= selection.max.row;
        if (rightClick && !disableContextMenu) {
            setContextMenu({ x: event.clientX, y: event.clientY });
        }
        if ((!(event.shiftKey && activeCell) || rightClick) &&
            data.length > 0) {
            setActiveCell(cursorIndex && {
                col: (rightClickInSelection || rightClickOnSelectedHeaders) &&
                    activeCell
                    ? activeCell.col
                    : Math.max(0, clickOnStickyRightColumn ? 0 : cursorIndex.col),
                row: (rightClickInSelection ||
                    rightClickOnSelectedGutter ||
                    clickOnSelectedStickyRightColumn) &&
                    activeCell
                    ? activeCell.row
                    : Math.max(0, cursorIndex.row),
            });
        }
        if (clickOnActiveCell && !rightClick) {
            lastEditingCellRef.current = activeCell;
        }
        setEditing(Boolean(clickOnActiveCell && !rightClick));
        setSelectionMode(cursorIndex && !rightClick
            ? {
                columns: (cursorIndex.col !== -1 && !clickOnStickyRightColumn) ||
                    Boolean(event.shiftKey && activeCell),
                rows: cursorIndex.row !== -1 ||
                    Boolean(event.shiftKey && activeCell),
                active: true,
            }
            : {
                columns: false,
                rows: false,
                active: false,
            });
        if (event.shiftKey && activeCell && !rightClick) {
            setSelectionCell(cursorIndex && {
                col: Math.max(0, cursorIndex.col - (clickOnStickyRightColumn ? 1 : 0)),
                row: Math.max(0, cursorIndex.row),
            });
        }
        else if (!rightClickInSelection) {
            if (cursorIndex &&
                ((cursorIndex === null || cursorIndex === void 0 ? void 0 : cursorIndex.col) === -1 ||
                    (cursorIndex === null || cursorIndex === void 0 ? void 0 : cursorIndex.row) === -1 ||
                    clickOnStickyRightColumn)) {
                let col = cursorIndex.col;
                let row = cursorIndex.row;
                if (cursorIndex.col === -1 || clickOnStickyRightColumn) {
                    col = columns.length - (hasStickyRightColumn ? 3 : 2);
                }
                if (cursorIndex.row === -1) {
                    row = data.length - 1;
                }
                if (rightClickOnSelectedHeaders && selectionCell) {
                    col = selectionCell.col;
                }
                if ((rightClickOnSelectedGutter ||
                    clickOnSelectedStickyRightColumn) &&
                    selectionCell) {
                    row = selectionCell.row;
                }
                setSelectionCell({ col, row });
            }
            else {
                setSelectionCell(null);
            }
            if (clickInside) {
                event.preventDefault();
            }
        }
    }, [
        contextMenu,
        contextMenuItems.length,
        getCursorIndex,
        editing,
        activeCell,
        columns,
        isCellDisabled,
        selection,
        hasStickyRightColumn,
        disableContextMenu,
        setSelectionMode,
        setActiveCell,
        setSelectionCell,
        selectionCell,
        data.length,
    ]);
    useDocumentEventListener('mousedown', onMouseDown);
    const onMouseUp = useCallback(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (expandingSelectionFromRowIndex !== null) {
            if (expandSelectionRowsCount > 0 && activeCell) {
                const copyData = [];
                const min = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
                const max = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
                for (let row = min.row; row <= max.row; ++row) {
                    copyData.push([]);
                    for (let col = min.col; col <= max.col; ++col) {
                        const { copyValue = () => null } = columns[col + 1];
                        copyData[row - min.row].push(String((_a = copyValue({ rowData: data[row], rowIndex: row })) !== null && _a !== void 0 ? _a : ''));
                    }
                }
                const newData = [...data];
                for (let columnIndex = 0; columnIndex < copyData[0].length; columnIndex++) {
                    const pasteValue = (_b = columns[min.col + columnIndex + 1]) === null || _b === void 0 ? void 0 : _b.pasteValue;
                    if (pasteValue) {
                        for (let rowIndex = max.row + 1; rowIndex <= max.row + expandSelectionRowsCount; rowIndex++) {
                            if (!isCellDisabled({
                                col: columnIndex + min.col,
                                row: rowIndex,
                            })) {
                                newData[rowIndex] = pasteValue({
                                    rowData: newData[rowIndex],
                                    value: copyData[(rowIndex - max.row - 1) % copyData.length][columnIndex],
                                    rowIndex,
                                });
                            }
                        }
                    }
                }
                onChange(newData);
                setExpandSelectionRowsCount(0);
                setActiveCell({
                    col: Math.min((_c = activeCell === null || activeCell === void 0 ? void 0 : activeCell.col) !== null && _c !== void 0 ? _c : Infinity, (_d = selection === null || selection === void 0 ? void 0 : selection.min.col) !== null && _d !== void 0 ? _d : Infinity),
                    row: Math.min((_e = activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== null && _e !== void 0 ? _e : Infinity, (_f = selection === null || selection === void 0 ? void 0 : selection.min.row) !== null && _f !== void 0 ? _f : Infinity),
                });
                setSelectionCell({
                    col: Math.max((_g = activeCell === null || activeCell === void 0 ? void 0 : activeCell.col) !== null && _g !== void 0 ? _g : 0, (_h = selection === null || selection === void 0 ? void 0 : selection.max.col) !== null && _h !== void 0 ? _h : 0),
                    row: Math.max((_j = activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== null && _j !== void 0 ? _j : 0, (_k = selection === null || selection === void 0 ? void 0 : selection.max.row) !== null && _k !== void 0 ? _k : 0) +
                        expandSelectionRowsCount,
                });
            }
            setExpandingSelectionFromRowIndex(null);
        }
        setSelectionMode({
            columns: false,
            rows: false,
            active: false,
        });
    }, [
        expandingSelectionFromRowIndex,
        setSelectionMode,
        expandSelectionRowsCount,
        activeCell,
        selection === null || selection === void 0 ? void 0 : selection.min,
        selection === null || selection === void 0 ? void 0 : selection.max,
        data,
        onChange,
        setActiveCell,
        setSelectionCell,
        columns,
        isCellDisabled,
    ]);
    useDocumentEventListener('mouseup', onMouseUp);
    const onMouseMove = useCallback((event) => {
        if (expandingSelectionFromRowIndex !== null) {
            const cursorIndex = getCursorIndex(event);
            if (cursorIndex) {
                setExpandSelectionRowsCount(Math.max(0, cursorIndex.row - expandingSelectionFromRowIndex));
                scrollTo({
                    col: cursorIndex.col,
                    row: Math.max(cursorIndex.row, expandingSelectionFromRowIndex),
                });
            }
        }
        if (selectionMode.active) {
            const cursorIndex = getCursorIndex(event);
            const lastColumnIndex = columns.length - (hasStickyRightColumn ? 3 : 2);
            setSelectionCell(cursorIndex && {
                col: selectionMode.columns
                    ? Math.max(0, Math.min(lastColumnIndex, cursorIndex.col))
                    : lastColumnIndex,
                row: selectionMode.rows
                    ? Math.max(0, cursorIndex.row)
                    : data.length - 1,
            });
            setEditing(false);
        }
    }, [
        scrollTo,
        selectionMode.active,
        selectionMode.columns,
        selectionMode.rows,
        getCursorIndex,
        columns.length,
        hasStickyRightColumn,
        setSelectionCell,
        data.length,
        expandingSelectionFromRowIndex,
    ]);
    useDocumentEventListener('mousemove', onMouseMove);
    const onKeyDown = useCallback((event) => {
        if (!activeCell) {
            return;
        }
        // Tab from last cell of a row
        if (event.key === 'Tab' &&
            !event.shiftKey &&
            activeCell.col ===
                columns.length - (hasStickyRightColumn ? 3 : 2) &&
            !columns[activeCell.col + 1].disableKeys) {
            // Last row
            if (activeCell.row === data.length - 1) {
                if (afterTabIndexRef.current) {
                    event.preventDefault();
                    setActiveCell(null);
                    setSelectionCell(null);
                    setEditing(false);
                    const allElements = getAllTabbableElements();
                    const index = allElements.indexOf(afterTabIndexRef.current);
                    allElements[(index + 1) % allElements.length].focus();
                    return;
                }
            }
            else {
                setActiveCell((cell) => { var _a; return ({ col: 0, row: ((_a = cell === null || cell === void 0 ? void 0 : cell.row) !== null && _a !== void 0 ? _a : 0) + 1 }); });
                setSelectionCell(null);
                setEditing(false);
                event.preventDefault();
                return;
            }
        }
        // Shift+Tab from first cell of a row
        if (event.key === 'Tab' &&
            event.shiftKey &&
            activeCell.col === 0 &&
            !columns[activeCell.col + 1].disableKeys) {
            // First row
            if (activeCell.row === 0) {
                if (beforeTabIndexRef.current) {
                    event.preventDefault();
                    setActiveCell(null);
                    setSelectionCell(null);
                    setEditing(false);
                    const allElements = getAllTabbableElements();
                    const index = allElements.indexOf(beforeTabIndexRef.current);
                    allElements[(index - 1 + allElements.length) % allElements.length].focus();
                    return;
                }
            }
            else {
                setActiveCell((cell) => {
                    var _a;
                    return ({
                        col: columns.length - (hasStickyRightColumn ? 3 : 2),
                        row: ((_a = cell === null || cell === void 0 ? void 0 : cell.row) !== null && _a !== void 0 ? _a : 1) - 1,
                    });
                });
                setSelectionCell(null);
                setEditing(false);
                event.preventDefault();
                return;
            }
        }
        if (event.key.startsWith('Arrow') || event.key === 'Tab') {
            if (editing && columns[activeCell.col + 1].disableKeys) {
                return;
            }
            if (editing && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                return;
            }
            const add = ([x, y], cell) => cell && {
                col: Math.max(0, Math.min(columns.length - (hasStickyRightColumn ? 3 : 2), cell.col + x)),
                row: Math.max(0, Math.min(data.length - 1, cell.row + y)),
            };
            if (event.key === 'Tab' && event.shiftKey) {
                setActiveCell((cell) => add([-1, 0], cell));
                setSelectionCell(null);
            }
            else {
                const direction = {
                    ArrowDown: [0, 1],
                    ArrowUp: [0, -1],
                    ArrowLeft: [-1, 0],
                    ArrowRight: [1, 0],
                    Tab: [1, 0],
                }[event.key];
                if (event.ctrlKey || event.metaKey) {
                    direction[0] *= columns.length;
                    direction[1] *= data.length;
                }
                if (event.shiftKey) {
                    setSelectionCell((cell) => add(direction, cell || activeCell));
                }
                else {
                    setActiveCell((cell) => add(direction, cell));
                    setSelectionCell(null);
                }
            }
            setEditing(false);
            event.preventDefault();
        }
        else if (event.key === 'Escape') {
            if (!editing && !selectionCell) {
                setActiveCell(null);
            }
            setSelectionCell(null);
            setEditing(false);
        }
        else if (event.key === 'Enter' &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            !event.shiftKey) {
            setSelectionCell(null);
            if (editing) {
                if (!columns[activeCell.col + 1].disableKeys) {
                    stopEditing();
                }
            }
            else if (!isCellDisabled(activeCell)) {
                lastEditingCellRef.current = activeCell;
                setEditing(true);
                scrollTo(activeCell);
            }
        }
        else if (event.key === 'Enter' &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            event.shiftKey) {
            insertRowAfter((selection === null || selection === void 0 ? void 0 : selection.max.row) || activeCell.row);
        }
        else if (event.key === 'd' &&
            (event.ctrlKey || event.metaKey) &&
            !event.altKey &&
            !event.shiftKey) {
            duplicateRows((selection === null || selection === void 0 ? void 0 : selection.min.row) || activeCell.row, selection === null || selection === void 0 ? void 0 : selection.max.row);
            event.preventDefault();
        }
        else if (event.key.match(/^[a-zA-Z0-9 ,.+-]$/) &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey) {
            if (!editing && !isCellDisabled(activeCell)) {
                lastEditingCellRef.current = activeCell;
                setSelectionCell(null);
                setEditing(true);
                scrollTo(activeCell);
            }
        }
        else if (['Backspace', 'Delete'].includes(event.key)) {
            if (!editing) {
                deleteSelection();
                event.preventDefault();
            }
        }
        else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
            if (!editing) {
                setActiveCell({ col: 0, row: 0 });
                setSelectionCell({
                    col: columns.length - (hasStickyRightColumn ? 3 : 2),
                    row: data.length - 1,
                });
                event.preventDefault();
            }
        }
    }, [
        activeCell,
        columns,
        data.length,
        deleteSelection,
        duplicateRows,
        editing,
        insertRowAfter,
        isCellDisabled,
        scrollTo,
        selection === null || selection === void 0 ? void 0 : selection.max.row,
        selection === null || selection === void 0 ? void 0 : selection.min.row,
        selectionCell,
        setActiveCell,
        setSelectionCell,
        stopEditing,
        hasStickyRightColumn,
    ]);
    useDocumentEventListener('keydown', onKeyDown);
    const onContextMenu = useCallback((event) => {
        var _a;
        const clickInside = ((_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) || false;
        const cursorIndex = clickInside
            ? getCursorIndex(event, true, true)
            : null;
        const clickOnActiveCell = cursorIndex &&
            activeCell &&
            activeCell.col === cursorIndex.col &&
            activeCell.row === cursorIndex.row &&
            editing;
        if (clickInside && !clickOnActiveCell) {
            event.preventDefault();
        }
    }, [getCursorIndex, activeCell, editing]);
    useDocumentEventListener('contextmenu', onContextMenu);
    useEffect(() => {
        const items = [];
        if ((selection === null || selection === void 0 ? void 0 : selection.max.row) !== undefined) {
            items.push({
                type: 'INSERT_ROW_BELLOW',
                action: () => {
                    setContextMenu(null);
                    insertRowAfter(selection.max.row);
                },
            });
        }
        else if ((activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== undefined) {
            items.push({
                type: 'INSERT_ROW_BELLOW',
                action: () => {
                    setContextMenu(null);
                    insertRowAfter(activeCell.row);
                },
            });
        }
        if ((selection === null || selection === void 0 ? void 0 : selection.min.row) !== undefined &&
            selection.min.row !== selection.max.row) {
            items.push({
                type: 'DUPLICATE_ROWS',
                fromRow: selection.min.row + 1,
                toRow: selection.max.row + 1,
                action: () => {
                    setContextMenu(null);
                    duplicateRows(selection.min.row, selection.max.row);
                },
            });
        }
        else if ((activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== undefined) {
            items.push({
                type: 'DUPLICATE_ROW',
                action: () => {
                    setContextMenu(null);
                    duplicateRows(activeCell.row);
                },
            });
        }
        if ((selection === null || selection === void 0 ? void 0 : selection.min.row) !== undefined &&
            selection.min.row !== selection.max.row) {
            items.push({
                type: 'DELETE_ROWS',
                fromRow: selection.min.row + 1,
                toRow: selection.max.row + 1,
                action: () => {
                    setContextMenu(null);
                    deleteRows(selection.min.row, selection.max.row);
                },
            });
        }
        else if ((activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) !== undefined) {
            items.push({
                type: 'DELETE_ROW',
                action: () => {
                    setContextMenu(null);
                    deleteRows(activeCell.row);
                },
            });
        }
        setContextMenuItems(items);
        if (!items.length) {
            setContextMenu(null);
        }
    }, [
        activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        deleteRows,
        duplicateRows,
        insertRowAfter,
        selection === null || selection === void 0 ? void 0 : selection.min.row,
        selection === null || selection === void 0 ? void 0 : selection.max.row,
    ]);
    const headerContext = useMemoObject({
        hasStickyRightColumn,
        height: headerRowHeight,
        contentWidth: fullWidth ? undefined : contentWidth,
        columns,
        activeColMin: (_c = selection === null || selection === void 0 ? void 0 : selection.min.col) !== null && _c !== void 0 ? _c : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col,
        activeColMax: (_d = selection === null || selection === void 0 ? void 0 : selection.max.col) !== null && _d !== void 0 ? _d : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col,
    });
    const selectionContext = useMemoObject({
        columnRights,
        columnWidths,
        activeCell,
        selection,
        headerRowHeight,
        rowHeight,
        hasStickyRightColumn,
        dataLength: data.length,
        viewHeight: height,
        viewWidth: width,
        contentWidth: fullWidth ? undefined : contentWidth,
        edges,
        editing,
        isCellDisabled,
        expandSelection,
    });
    const contextMenuItemsRef = useRef(contextMenuItems);
    contextMenuItemsRef.current = contextMenuItems;
    const getContextMenuItems = useCallback(() => contextMenuItemsRef.current, []);
    const itemData = useMemoObject({
        data,
        contentWidth: fullWidth ? undefined : contentWidth,
        columns,
        hasStickyRightColumn,
        activeCell,
        selectionMinRow: (_e = selection === null || selection === void 0 ? void 0 : selection.min.row) !== null && _e !== void 0 ? _e : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        selectionMaxRow: (_f = selection === null || selection === void 0 ? void 0 : selection.max.row) !== null && _f !== void 0 ? _f : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        editing,
        setRowData,
        deleteRows,
        duplicateRows,
        insertRowAfter,
        stopEditing,
        getContextMenuItems,
    });
    const itemSize = useCallback((index) => (index === 0 ? headerRowHeight : rowHeight), [headerRowHeight, rowHeight]);
    useImperativeHandle(ref, () => ({
        activeCell: getCellWithId(activeCell, columns),
        selection: getSelectionWithId(selection !== null && selection !== void 0 ? selection : (activeCell ? { min: activeCell, max: activeCell } : null), columns),
        setSelection: (value) => {
            const selection = getSelection(value, columns.length - (hasStickyRightColumn ? 2 : 1), data.length, columns);
            setActiveCell((selection === null || selection === void 0 ? void 0 : selection.min) || null);
            setEditing(false);
            setSelectionMode({ columns: false, active: false, rows: false });
            setSelectionCell((selection === null || selection === void 0 ? void 0 : selection.max) || null);
        },
        setActiveCell: (value) => {
            const cell = getCell(value, columns.length - (hasStickyRightColumn ? 2 : 1), data.length, columns);
            setActiveCell(cell);
            setEditing(false);
            setSelectionMode({ columns: false, active: false, rows: false });
            setSelectionCell(null);
        },
    }));
    const callbacksRef = useRef({
        onFocus,
        onBlur,
        onActiveCellChange,
        onSelectionChange,
    });
    callbacksRef.current.onFocus = onFocus;
    callbacksRef.current.onBlur = onBlur;
    callbacksRef.current.onActiveCellChange = onActiveCellChange;
    callbacksRef.current.onSelectionChange = onSelectionChange;
    useEffect(() => {
        if (lastEditingCellRef.current) {
            if (editing) {
                callbacksRef.current.onFocus({
                    cell: getCellWithId(lastEditingCellRef.current, columns),
                });
            }
            else {
                callbacksRef.current.onBlur({
                    cell: getCellWithId(lastEditingCellRef.current, columns),
                });
            }
        }
    }, [editing, columns]);
    useEffect(() => {
        callbacksRef.current.onActiveCellChange({
            cell: getCellWithId(activeCell, columns),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCell === null || activeCell === void 0 ? void 0 : activeCell.col, activeCell === null || activeCell === void 0 ? void 0 : activeCell.row, columns]);
    useEffect(() => {
        callbacksRef.current.onSelectionChange({
            selection: getSelectionWithId(selection !== null && selection !== void 0 ? selection : (activeCell ? { min: activeCell, max: activeCell } : null), columns),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (_g = selection === null || selection === void 0 ? void 0 : selection.min.col) !== null && _g !== void 0 ? _g : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (_h = selection === null || selection === void 0 ? void 0 : selection.min.row) !== null && _h !== void 0 ? _h : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (_j = selection === null || selection === void 0 ? void 0 : selection.max.col) !== null && _j !== void 0 ? _j : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (_k = selection === null || selection === void 0 ? void 0 : selection.max.row) !== null && _k !== void 0 ? _k : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        activeCell === null || activeCell === void 0 ? void 0 : activeCell.col,
        activeCell === null || activeCell === void 0 ? void 0 : activeCell.row,
        columns,
    ]);
    return (React.createElement("div", { className: className, style: style },
        React.createElement("div", { ref: beforeTabIndexRef, tabIndex: rawColumns.length && data.length ? 0 : undefined, onFocus: (e) => {
                e.target.blur();
                setActiveCell({ col: 0, row: 0 });
            } }),
        React.createElement(HeaderContext.Provider, { value: headerContext },
            React.createElement(SelectionContext.Provider, { value: selectionContext },
                React.createElement(VariableSizeList, { className: "dsg-container", width: "100%", ref: listRef, height: displayHeight, itemCount: data.length + 1, itemSize: itemSize, estimatedItemSize: rowHeight, itemData: itemData, outerRef: outerRef, innerRef: innerRef, innerElementType: InnerContainer, children: Row, useIsScrolling: columns.some(({ renderWhenScrolling }) => !renderWhenScrolling) }))),
        React.createElement("div", { ref: afterTabIndexRef, tabIndex: rawColumns.length && data.length ? 0 : undefined, onFocus: (e) => {
                e.target.blur();
                setActiveCell({
                    col: columns.length - (hasStickyRightColumn ? 3 : 2),
                    row: data.length - 1,
                });
            } }),
        !lockRows && (React.createElement(AddRowsComponent, { addRows: (count) => insertRowAfter(data.length - 1, count) })),
        contextMenu && contextMenuItems.length > 0 && (React.createElement(ContextMenuComponent, { clientX: contextMenu.x, clientY: contextMenu.y, items: contextMenuItems, close: () => setContextMenu(null) }))));
}));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
DataSheetGrid.displayName = 'DataSheetGrid';
//# sourceMappingURL=DataSheetGrid.js.map