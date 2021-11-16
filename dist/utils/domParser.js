const parser = typeof DOMParser !== 'undefined'
    ? new DOMParser()
    : { parseFromString: () => null };
export const parseDom = (html) => {
    return parser.parseFromString(html, 'text/html');
};
//# sourceMappingURL=domParser.js.map