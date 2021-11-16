import { useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { useDeepEqualState } from './useDeepEqualState';
export const useEdges = (ref, width, height) => {
    const [edges, setEdges] = useDeepEqualState({
        top: true,
        right: true,
        bottom: true,
        left: true,
    });
    useEffect(() => {
        const onScroll = throttle(100, () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            setEdges({
                top: ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.scrollTop) === 0,
                right: ((_b = ref.current) === null || _b === void 0 ? void 0 : _b.scrollLeft) ===
                    ((_d = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.scrollWidth) !== null && _d !== void 0 ? _d : 0) - (width !== null && width !== void 0 ? width : 0),
                bottom: ((_e = ref.current) === null || _e === void 0 ? void 0 : _e.scrollTop) ===
                    ((_g = (_f = ref.current) === null || _f === void 0 ? void 0 : _f.scrollHeight) !== null && _g !== void 0 ? _g : 0) - (height !== null && height !== void 0 ? height : 0),
                left: ((_h = ref.current) === null || _h === void 0 ? void 0 : _h.scrollLeft) === 0,
            });
        });
        const current = ref.current;
        current === null || current === void 0 ? void 0 : current.addEventListener('scroll', onScroll);
        setTimeout(onScroll, 100);
        return () => {
            current === null || current === void 0 ? void 0 : current.removeEventListener('scroll', onScroll);
            onScroll.cancel();
        };
    }, [height, width, ref, setEdges]);
    return edges;
};
//# sourceMappingURL=useEdges.js.map