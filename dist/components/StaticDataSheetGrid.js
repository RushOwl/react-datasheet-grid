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
import { useState } from 'react';
import { DataSheetGrid } from './DataSheetGrid';
import React from 'react';
export const StaticDataSheetGrid = React.forwardRef((_a, ref) => {
    var { columns, gutterColumn, stickyRightColumn, addRowsComponent, createRow, duplicateRow, style, onFocus, onBlur, onActiveCellChange, onSelectionChange } = _a, rest = __rest(_a, ["columns", "gutterColumn", "stickyRightColumn", "addRowsComponent", "createRow", "duplicateRow", "style", "onFocus", "onBlur", "onActiveCellChange", "onSelectionChange"]);
    const [staticProps] = useState({
        columns,
        gutterColumn,
        stickyRightColumn,
        addRowsComponent,
        createRow,
        duplicateRow,
        style,
        onFocus,
        onBlur,
        onActiveCellChange,
        onSelectionChange,
    });
    return React.createElement(DataSheetGrid, Object.assign({}, staticProps, rest, { ref: ref }));
});
//# sourceMappingURL=StaticDataSheetGrid.js.map