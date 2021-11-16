import React, { useLayoutEffect, useRef } from 'react';
const DateComponent = React.memo(({ focus, active, rowData, setRowData }) => {
    var _a;
    const ref = useRef(null);
    // This is the same trick as in `textColumn`
    useLayoutEffect(() => {
        var _a, _b;
        if (focus) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.select();
        }
        else {
            (_b = ref.current) === null || _b === void 0 ? void 0 : _b.blur();
        }
    }, [focus]);
    return (React.createElement("input", { className: "dsg-input", type: "date", 
        // Important to prevent any undesired "tabbing"
        tabIndex: -1, ref: ref, 
        // The `pointerEvents` trick is the same than in `textColumn`
        // Only show the calendar symbol on non-empty cells, or when cell is active, otherwise set opacity to 0
        style: {
            pointerEvents: focus ? 'auto' : 'none',
            opacity: rowData || active ? undefined : 0,
        }, 
        // Because rowData is a Date object and we need a string, we use toISOString...
        value: (_a = rowData === null || rowData === void 0 ? void 0 : rowData.toISOString().substr(0, 10)) !== null && _a !== void 0 ? _a : '', 
        // ...and the input returns a string that should be converted into a Date object
        onChange: (e) => {
            const date = new Date(e.target.value);
            setRowData(isNaN(date.getTime()) ? null : date);
        } }));
});
DateComponent.displayName = 'DateComponent';
export const dateColumn = {
    component: DateComponent,
    deleteValue: () => null,
    // We convert the date to a string for copying using toISOString
    copyValue: ({ rowData }) => rowData ? rowData.toISOString().substr(0, 10) : null,
    // Because the Date constructor works using iso format, we can use it to parse ISO string back to a Date object
    pasteValue: ({ value }) => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    },
    minWidth: 170,
    isCellEmpty: ({ rowData }) => !rowData,
};
//# sourceMappingURL=dateColumn.js.map