import React from 'react';
export const SelectionContext = React.createContext({
    selection: null,
    headerRowHeight: 0,
    activeCell: null,
    rowHeight: 0,
    hasStickyRightColumn: false,
    dataLength: 0,
    edges: {
        top: true,
        left: true,
        bottom: true,
        right: true,
    },
    editing: false,
    isCellDisabled: () => false,
    expandSelection: null,
});
//# sourceMappingURL=SelectionContext.js.map