export const getCell = (value, colMax, rowMax, columns) => {
    if (value === null || !colMax || !rowMax) {
        return null;
    }
    if (typeof value !== 'object') {
        throw new Error('Value must be an object or null');
    }
    const colIndex = columns.findIndex((column) => column.id === value.col);
    const cell = {
        col: Math.max(0, Math.min(colMax - 1, colIndex === -1 ? Number(value.col) : colIndex - 1)),
        row: Math.max(0, Math.min(rowMax - 1, Number(value.row))),
    };
    if (isNaN(cell.col) || isNaN(cell.row)) {
        throw new Error('col or cell are not valid positive numbers');
    }
    return cell;
};
export const getCellWithId = (cell, columns) => {
    var _a;
    return cell
        ? Object.assign(Object.assign({}, cell), { colId: (_a = columns[cell.col + 1]) === null || _a === void 0 ? void 0 : _a.id }) : null;
};
export const getSelection = (value, colMax, rowMax, columns) => {
    if (value === null || !colMax || !rowMax) {
        return null;
    }
    if (typeof value !== 'object') {
        throw new Error('Value must be an object or null');
    }
    const selection = {
        min: getCell(value.min, colMax, rowMax, columns),
        max: getCell(value.max, colMax, rowMax, columns),
    };
    if (!selection.min || !selection.max) {
        throw new Error('min and max must be defined');
    }
    return selection;
};
export const getSelectionWithId = (selection, columns) => selection
    ? {
        min: getCellWithId(selection.min, columns),
        max: getCellWithId(selection.max, columns),
    }
    : null;
//# sourceMappingURL=typeCheck.js.map