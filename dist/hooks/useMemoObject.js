import { useMemo } from 'react';
export const useMemoObject = (object) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => object, Object.values(object));
};
//# sourceMappingURL=useMemoObject.js.map