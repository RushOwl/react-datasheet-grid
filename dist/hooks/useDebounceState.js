import { useMemo, useState } from 'react';
import { debounce } from 'throttle-debounce';
export const useDebounceState = (defaultValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(defaultValue);
    const setValue = useMemo(() => debounce(delay, (newValue) => {
        setDebouncedValue(newValue);
    }), [delay]);
    return [debouncedValue, setValue];
};
//# sourceMappingURL=useDebounceState.js.map