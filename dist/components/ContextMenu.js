import * as React from 'react';
import { useCallback, useRef } from 'react';
import { useDocumentEventListener } from '../hooks/useDocumentEventListener';
const renderItem = (item) => {
    if (item.type === 'DELETE_ROW') {
        return 'Delete row';
    }
    if (item.type === 'DELETE_ROWS') {
        return (React.createElement(React.Fragment, null,
            "Delete rows ",
            React.createElement("b", null, item.fromRow),
            " to ",
            React.createElement("b", null, item.toRow)));
    }
    if (item.type === 'INSERT_ROW_BELLOW') {
        return 'Insert row below';
    }
    if (item.type === 'DUPLICATE_ROW') {
        return 'Duplicate row';
    }
    if (item.type === 'DUPLICATE_ROWS') {
        return (React.createElement(React.Fragment, null,
            "Duplicate rows ",
            React.createElement("b", null, item.fromRow),
            " to ",
            React.createElement("b", null, item.toRow)));
    }
    return item.type;
};
export const ContextMenu = ({ clientX, clientY, items, close, }) => {
    const containerRef = useRef(null);
    const onClickOutside = useCallback((event) => {
        var _a;
        const clickInside = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target);
        if (!clickInside) {
            close();
        }
    }, [close]);
    useDocumentEventListener('mousedown', onClickOutside);
    return (React.createElement("div", { className: "dsg-context-menu", style: { left: clientX + 'px', top: clientY + 'px' }, ref: containerRef }, items.map((item) => (React.createElement("div", { key: item.type, onClick: item.action, className: "dsg-context-menu-item" }, renderItem(item))))));
};
//# sourceMappingURL=ContextMenu.js.map