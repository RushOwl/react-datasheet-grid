import React, { useEffect, useLayoutEffect, useRef } from 'react';
import cx from 'classnames';
const TextComponent = React.memo(({ focus, rowData, setRowData, columnData: { placeholder, alignRight, formatInputOnFocus, formatBlurredInput, parseUserInput, continuousUpdates, }, }) => {
    const ref = useRef(null);
    // We create refs for async access so we don't have to add it to the useEffect dependencies
    const asyncRef = useRef({
        rowData,
        formatInputOnFocus,
        formatBlurredInput,
        setRowData,
        parseUserInput,
        continuousUpdates,
        // This allows us to keep track of whether or not the user blurred the input using the Esc key
        // If the Esc key is used we do not update the row's value (only relevant when continuousUpdates is false)
        escPressed: false,
    });
    asyncRef.current = {
        rowData,
        formatInputOnFocus,
        formatBlurredInput,
        setRowData,
        parseUserInput,
        continuousUpdates,
        // Keep the same value across renders
        escPressed: asyncRef.current.escPressed,
    };
    useLayoutEffect(() => {
        // When the cell gains focus we make sure to immediately select the text in the input:
        // - If the user gains focus by typing, it will replace the existing text, as expected
        // - If the user gains focus by clicking or pressing Enter, the text will be preserved and selected
        if (focus) {
            if (ref.current) {
                // Make sure to first format the input
                ref.current.value = asyncRef.current.formatInputOnFocus(asyncRef.current.rowData);
                ref.current.select();
            }
            // We immediately reset the escPressed
            asyncRef.current.escPressed = false;
        }
        // When the cell looses focus (by pressing Esc, Enter, clicking away...) we make sure to blur the input
        // Otherwise the user would still see the cursor blinking
        else {
            if (ref.current) {
                // Update the row's value on blur only if the user did not press escape (only relevant when continuousUpdates is false)
                if (!asyncRef.current.escPressed &&
                    !asyncRef.current.continuousUpdates) {
                    asyncRef.current.setRowData(asyncRef.current.parseUserInput(ref.current.value));
                }
                ref.current.blur();
            }
        }
    }, [focus]);
    useEffect(() => {
        if (!focus && ref.current) {
            // On blur or when the data changes, format it for display
            ref.current.value = asyncRef.current.formatBlurredInput(rowData);
        }
    }, [focus, rowData]);
    return (React.createElement("input", { 
        // We use an uncontrolled component for better performance
        defaultValue: formatBlurredInput(rowData), className: cx('dsg-input', alignRight && 'dsg-input-align-right'), placeholder: placeholder, 
        // Important to prevent any undesired "tabbing"
        tabIndex: -1, ref: ref, 
        // Make sure that while the cell is not focus, the user cannot interact with the input
        // The cursor will not change to "I", the style of the input will not change,
        // and the user cannot click and edit the input (this part is handled by DataSheetGrid itself)
        style: { pointerEvents: focus ? 'auto' : 'none' }, onChange: (e) => {
            // Only update the row's value as the user types if continuousUpdates is true
            if (continuousUpdates) {
                setRowData(parseUserInput(e.target.value));
            }
        }, onKeyDown: (e) => {
            // Track when user presses the Esc key
            if (e.key === 'Escape') {
                asyncRef.current.escPressed = true;
            }
        } }));
});
TextComponent.displayName = 'TextComponent';
export const textColumn = createTextColumn();
export function createTextColumn({ placeholder, alignRight = false, continuousUpdates = true, deletedValue = null, parseUserInput = (value) => (value.trim() || null), formatBlurredInput = (value) => String(value !== null && value !== void 0 ? value : ''), formatInputOnFocus = (value) => String(value !== null && value !== void 0 ? value : ''), formatForCopy = (value) => String(value !== null && value !== void 0 ? value : ''), parsePastedValue = (value) => (value.replace(/[\n\r]+/g, ' ').trim() || null), } = {}) {
    return {
        component: TextComponent,
        columnData: {
            placeholder,
            alignRight,
            continuousUpdates,
            formatInputOnFocus,
            formatBlurredInput,
            parseUserInput,
        },
        deleteValue: () => deletedValue,
        copyValue: ({ rowData }) => formatForCopy(rowData),
        pasteValue: ({ value }) => parsePastedValue(value),
        isCellEmpty: ({ rowData }) => rowData === null || rowData === undefined,
    };
}
//# sourceMappingURL=textColumn.js.map