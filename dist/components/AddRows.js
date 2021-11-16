import React, { useState } from 'react';
export const AddRows = ({ addRows }) => {
    const [value, setValue] = useState(1);
    const [rawValue, setRawValue] = useState(String(value));
    return (React.createElement("div", { className: "dsg-add-row" },
        React.createElement("button", { className: "dsg-add-row-btn", onClick: () => addRows(value) }, "Add"),
        ' ',
        React.createElement("input", { className: "dsg-add-row-input", value: rawValue, onBlur: () => setRawValue(String(value)), onChange: (e) => {
                setRawValue(e.target.value);
                setValue(Math.max(1, Math.round(parseInt(e.target.value) || 0)));
            }, onKeyPress: (event) => {
                if (event.key === 'Enter') {
                    addRows(value);
                }
            } }),
        ' ',
        "rows"));
};
//# sourceMappingURL=AddRows.js.map