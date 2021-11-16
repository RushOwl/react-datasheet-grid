import { useRef } from 'react';
export const useRefObject = (object) => {
    const ref = useRef(object);
    ref.current = object;
    return ref;
};
//# sourceMappingURL=useRefObject.js.map