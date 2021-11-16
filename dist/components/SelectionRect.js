import React, { useContext, useMemo } from 'react';
import { SelectionContext } from '../contexts/SelectionContext';
import cx from 'classnames';
const buildSquare = (top, right, bottom, left) => {
    return [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
        [left, top],
    ];
};
const buildClipPath = (top, right, bottom, left) => {
    const values = [
        ...buildSquare(0, '100%', '100%', 0),
        ...buildSquare(top, right, bottom, left),
    ];
    return `polygon(evenodd, ${values
        .map((pair) => pair
        .map((value) => typeof value === 'number' && value !== 0 ? value + 'px' : value)
        .join(' '))
        .join(',')})`;
};
export const SelectionRect = React.memo(() => {
    var _a, _b, _c, _d;
    const { columnWidths, columnRights, headerRowHeight, selection, rowHeight, activeCell, hasStickyRightColumn, dataLength, viewWidth, viewHeight, contentWidth, edges, isCellDisabled, editing, expandSelection, } = useContext(SelectionContext);
    const activeCellIsDisabled = activeCell ? isCellDisabled(activeCell) : false;
    const selectionIsDisabled = useMemo(() => {
        if (!selection) {
            return activeCellIsDisabled;
        }
        for (let col = selection.min.col; col <= selection.max.col; ++col) {
            for (let row = selection.min.row; row <= selection.max.row; ++row) {
                if (!isCellDisabled({ col, row })) {
                    return false;
                }
            }
        }
        return true;
    }, [activeCellIsDisabled, isCellDisabled, selection]);
    if (!columnWidths || !columnRights) {
        return null;
    }
    const extraPixelV = (rowI) => {
        return rowI < dataLength - 1 ? 1 : 0;
    };
    const extraPixelH = (colI) => {
        return colI < columnWidths.length - (hasStickyRightColumn ? 3 : 2) ? 1 : 0;
    };
    const activeCellRect = activeCell && {
        width: columnWidths[activeCell.col + 1] + extraPixelH(activeCell.col),
        height: rowHeight + extraPixelV(activeCell.row),
        left: columnRights[activeCell.col],
        top: rowHeight * activeCell.row + headerRowHeight,
    };
    const selectionRect = selection && {
        width: columnWidths
            .slice(selection.min.col + 1, selection.max.col + 2)
            .reduce((a, b) => a + b) + extraPixelH(selection.max.col),
        height: rowHeight * (selection.max.row - selection.min.row + 1) +
            extraPixelV(selection.max.row),
        left: columnRights[selection.min.col],
        top: rowHeight * selection.min.row + headerRowHeight,
    };
    const minSelection = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
    const maxSelection = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
    const expandRowsIndicator = maxSelection &&
        expandSelection !== null && {
        left: columnRights[maxSelection.col] + columnWidths[maxSelection.col + 1],
        top: rowHeight * (maxSelection.row + 1) + headerRowHeight,
        transform: `translate(-${maxSelection.col < columnWidths.length - (hasStickyRightColumn ? 3 : 2)
            ? 50
            : 100}%, -${maxSelection.row < dataLength - 1 ? 50 : 100}%)`,
    };
    const expandRowsRect = minSelection &&
        maxSelection &&
        expandSelection !== null && {
        width: columnWidths
            .slice(minSelection.col + 1, maxSelection.col + 2)
            .reduce((a, b) => a + b) + extraPixelH(maxSelection.col),
        height: rowHeight * expandSelection +
            extraPixelV(maxSelection.row + expandSelection) -
            1,
        left: columnRights[minSelection.col],
        top: rowHeight * (maxSelection.row + 1) + headerRowHeight + 1,
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dsg-scrollable-view-container", style: {
                height: dataLength * rowHeight + headerRowHeight,
                width: contentWidth ? contentWidth : '100%',
            } },
            React.createElement("div", { className: cx({
                    'dsg-scrollable-view': true,
                    'dsg-scrollable-view-t': !edges.top,
                    'dsg-scrollable-view-r': !edges.right,
                    'dsg-scrollable-view-b': !edges.bottom,
                    'dsg-scrollable-view-l': !edges.left,
                }), style: {
                    top: headerRowHeight,
                    left: columnWidths[0],
                    height: viewHeight ? viewHeight - headerRowHeight : 0,
                    width: contentWidth && viewWidth
                        ? viewWidth -
                            columnWidths[0] -
                            (hasStickyRightColumn
                                ? columnWidths[columnWidths.length - 1]
                                : 0)
                        : `calc(100% - ${columnWidths[0] +
                            (hasStickyRightColumn
                                ? columnWidths[columnWidths.length - 1]
                                : 0)}px)`,
                } })),
        (selectionRect || activeCellRect) && (React.createElement("div", { className: "dsg-selection-col-marker-container", style: {
                left: (_a = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.left) !== null && _a !== void 0 ? _a : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.left,
                width: (_b = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.width) !== null && _b !== void 0 ? _b : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.width,
                height: dataLength * rowHeight + headerRowHeight,
            } },
            React.createElement("div", { className: cx('dsg-selection-col-marker', selectionIsDisabled && 'dsg-selection-col-marker-disabled'), style: { top: headerRowHeight } }))),
        (selectionRect || activeCellRect) && (React.createElement("div", { className: "dsg-selection-row-marker-container", style: {
                top: (_c = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.top) !== null && _c !== void 0 ? _c : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.top,
                height: (_d = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.height) !== null && _d !== void 0 ? _d : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.height,
                width: contentWidth ? contentWidth : '100%',
            } },
            React.createElement("div", { className: cx('dsg-selection-row-marker', selectionIsDisabled && 'dsg-selection-row-marker-disabled'), style: { left: columnWidths[0] } }))),
        activeCellRect && activeCell && (React.createElement("div", { className: cx('dsg-active-cell', {
                'dsg-active-cell-focus': editing,
                'dsg-active-cell-disabled': activeCellIsDisabled,
            }), style: activeCellRect })),
        selectionRect && activeCellRect && (React.createElement("div", { className: cx('dsg-selection-rect', selectionIsDisabled && 'dsg-selection-rect-disabled'), style: Object.assign(Object.assign({}, selectionRect), { clipPath: buildClipPath(activeCellRect.top - selectionRect.top, activeCellRect.left - selectionRect.left, activeCellRect.top + activeCellRect.height - selectionRect.top, activeCellRect.left + activeCellRect.width - selectionRect.left) }) })),
        expandRowsRect && (React.createElement("div", { className: cx('dsg-expand-rows-rect'), style: expandRowsRect })),
        expandRowsIndicator && (React.createElement("div", { className: cx('dsg-expand-rows-indicator', selectionIsDisabled && 'dsg-expand-rows-indicator-disabled'), style: expandRowsIndicator }))));
});
SelectionRect.displayName = 'SelectionRect';
//# sourceMappingURL=SelectionRect.js.map