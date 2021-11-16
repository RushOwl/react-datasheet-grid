import React, { useMemo } from 'react';
const defaultComponent = () => React.createElement(React.Fragment, null);
const defaultIsCellEmpty = () => false;
const identityRow = ({ rowData }) => rowData;
const defaultCopyValue = () => null;
const defaultGutterComponent = ({ rowIndex }) => (React.createElement(React.Fragment, null, rowIndex + 1));
const cellAlwaysEmpty = () => true;
export const useColumns = (columns, gutterColumn, stickyRightColumn) => {
    return useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        const partialColumns = [
            Object.assign(Object.assign({}, gutterColumn), { width: (_a = gutterColumn === null || gutterColumn === void 0 ? void 0 : gutterColumn.width) !== null && _a !== void 0 ? _a : '0 0 40px', minWidth: (_b = gutterColumn === null || gutterColumn === void 0 ? void 0 : gutterColumn.minWidth) !== null && _b !== void 0 ? _b : 0, title: (_c = gutterColumn === null || gutterColumn === void 0 ? void 0 : gutterColumn.title) !== null && _c !== void 0 ? _c : React.createElement("div", { className: "dsg-corner-indicator" }), component: (_d = gutterColumn === null || gutterColumn === void 0 ? void 0 : gutterColumn.component) !== null && _d !== void 0 ? _d : defaultGutterComponent, isCellEmpty: cellAlwaysEmpty }),
            ...columns,
        ];
        if (stickyRightColumn) {
            partialColumns.push(Object.assign(Object.assign({}, stickyRightColumn), { width: (_e = stickyRightColumn.width) !== null && _e !== void 0 ? _e : '0 0 40px', minWidth: (_f = stickyRightColumn.minWidth) !== null && _f !== void 0 ? _f : 0, isCellEmpty: cellAlwaysEmpty }));
        }
        return partialColumns.map((column) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return (Object.assign(Object.assign({}, column), { width: (_a = column.width) !== null && _a !== void 0 ? _a : 1, minWidth: (_b = column.minWidth) !== null && _b !== void 0 ? _b : 100, renderWhenScrolling: (_c = column.renderWhenScrolling) !== null && _c !== void 0 ? _c : true, component: (_d = column.component) !== null && _d !== void 0 ? _d : defaultComponent, disableKeys: (_e = column.disableKeys) !== null && _e !== void 0 ? _e : false, disabled: (_f = column.disabled) !== null && _f !== void 0 ? _f : false, keepFocus: (_g = column.keepFocus) !== null && _g !== void 0 ? _g : false, deleteValue: (_h = column.deleteValue) !== null && _h !== void 0 ? _h : identityRow, copyValue: (_j = column.copyValue) !== null && _j !== void 0 ? _j : defaultCopyValue, pasteValue: (_k = column.pasteValue) !== null && _k !== void 0 ? _k : identityRow, isCellEmpty: (_l = column.isCellEmpty) !== null && _l !== void 0 ? _l : defaultIsCellEmpty }));
        });
    }, [gutterColumn, stickyRightColumn, columns]);
};
//# sourceMappingURL=useColumns.js.map