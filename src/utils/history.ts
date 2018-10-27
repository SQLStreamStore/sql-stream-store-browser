import { createBrowserHistory } from 'history';
import { parse } from 'uri-js';

const history = createBrowserHistory();

const getPathAndQuery = (url: string): string => {
    const { path, query } = parse(url);

    return query ? `${path}?${query}` : path || '';
};

const push = (url: string) => {
    const pathAndQuery = getPathAndQuery(url);
    if (pathAndQuery !== getPathAndQuery(window.location.href)) {
        history.push(pathAndQuery);
    }
};

export default {
    ...history,
    push,
};
