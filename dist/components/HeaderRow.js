import React, { useContext } from 'react';
import { HeaderContext } from '../contexts/HeaderContext';
import cx from 'classnames';
import { Cell } from './Cell';
export const HeaderRow = React.memo(() => {
    const { columns, contentWidth, height, hasStickyRightColumn, activeColMin, activeColMax, } = useContext(HeaderContext);
    return (React.createElement("div", { className: cx('dsg-row', 'dsg-row-header'), style: {
            width: contentWidth ? contentWidth : '100%',
            height,
        } }, columns.map((column, i) => (React.createElement(Cell, { key: i, gutter: i === 0, stickyRight: hasStickyRightColumn && i === columns.length - 1, column: column, className: cx('dsg-cell-header', activeColMin !== undefined &&
            activeColMax !== undefined &&
            activeColMin <= i - 1 &&
            activeColMax >= i - 1 &&
            'dsg-cell-header-active', column.headerClassName) },
        React.createElement("div", { className: "dsg-cell-header-container" }, column.title))))));
});
HeaderRow.displayName = 'HeaderRow';
//# sourceMappingURL=HeaderRow.js.map