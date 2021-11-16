import { useCallback, useState } from 'react';
import deepEqual from 'fast-deep-equal';
export const useDeepEqualState = (defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    const customSetValue = useCallback((newValue) => {
        setValue((prevValue) => {
            const nextValue = typeof newValue === 'function'
                ? newValue(prevValue)
                : newValue;
            return deepEqual(nextValue, prevValue) ? prevValue : nextValue;
        });
    }, [setValue]);
    return [value, customSetValue];
};
//# sourceMappingURL=useDeepEqualState.js.map