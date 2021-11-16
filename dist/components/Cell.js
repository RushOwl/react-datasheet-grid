import React from 'react';
import cx from 'classnames';
export const Cell = ({ children, gutter, stickyRight, column, active, disabled, className, }) => {
    return (React.createElement("div", { className: cx('dsg-cell', gutter && 'dsg-cell-gutter', disabled && 'dsg-cell-disabled', gutter && active && 'dsg-cell-gutter-active', stickyRight && 'dsg-cell-sticky-right', className), style: {
            flex: String(column.width),
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
        } }, children));
};
//# sourceMappingURL=Cell.js.map