import { useEffect, useMemo, useState } from 'react';
import { useDeepEqualState } from './useDeepEqualState';
export const useColumnWidths = (columns, width) => {
    const [columnWidths, setColumnWidths] = useDeepEqualState(undefined);
    const [prevWidth, setPrevWidth] = useState(width);
    const { totalWidth, columnRights } = useMemo(() => {
        if (!columnWidths) {
            return { totalWidth: undefined, columnRights: undefined };
        }
        let total = 0;
        const columnRights = columnWidths.map((w, i) => {
            total += w;
            return i === columnWidths.length - 1 ? Infinity : total;
        });
        return {
            columnRights,
            totalWidth: total,
        };
    }, [columnWidths]);
    const columnsHash = columns
        .map(({ width, minWidth, maxWidth }) => [width, minWidth, maxWidth].join(','))
        .join('|');
    useEffect(() => {
        if (width === undefined) {
            return;
        }
        const el = document.createElement('div');
        el.style.display = 'flex';
        el.style.position = 'fixed';
        el.style.width = `${width}px`;
        el.style.left = '-999px';
        el.style.top = '-1px';
        const children = columns.map((column) => {
            const child = document.createElement('div');
            child.style.display = 'block';
            child.style.flex = String(column.width);
            child.style.minWidth = `${column.minWidth}px`;
            child.style.maxWidth = `${column.maxWidth}px`;
            return child;
        });
        children.forEach((child) => el.appendChild(child));
        document.body.insertBefore(el, null);
        setColumnWidths(children.map((child) => child.offsetWidth));
        setPrevWidth(width);
        el.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, columnsHash]);
    return {
        fullWidth: prevWidth === totalWidth,
        columnWidths,
        columnRights,
        totalWidth,
    };
};
//# sourceMappingURL=useColumnWidths.js.map