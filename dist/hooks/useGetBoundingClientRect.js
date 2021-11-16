import { useCallback, useMemo, useRef } from 'react';
import { throttle } from 'throttle-debounce';
// Cache bounding rect in a ref and only recompute every <delay>ms
export const useGetBoundingClientRect = (ref, delay = 200) => {
    const boundingRect = useRef(null);
    const throttledCompute = useMemo(() => throttle(delay, true, () => {
        setTimeout(() => {
            var _a;
            return (boundingRect.current =
                ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || null);
        }, 0);
    }), [ref, delay]);
    return useCallback((force = false) => {
        var _a;
        if (force) {
            boundingRect.current = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || null;
        }
        else {
            throttledCompute();
        }
        return boundingRect.current;
    }, [ref, throttledCompute]);
};
//# sourceMappingURL=useGetBoundingClientRect.js.map