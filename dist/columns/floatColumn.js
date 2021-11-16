import { createTextColumn } from './textColumn';
export const floatColumn = createTextColumn({
    alignRight: true,
    formatBlurredInput: (value) => typeof value === 'number' ? new Intl.NumberFormat().format(value) : '',
    parseUserInput: (value) => {
        const number = parseFloat(value);
        return !isNaN(number) ? number : null;
    },
    parsePastedValue: (value) => {
        const number = parseFloat(value);
        return !isNaN(number) ? number : null;
    },
});
//# sourceMappingURL=floatColumn.js.map