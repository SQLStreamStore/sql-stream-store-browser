import { createBrowserHistory } from 'history';

const removeOrigin = href => href.substring(new URL(href).origin.length);

const history = createBrowserHistory();

const push = url => {
    const pathNameAndQuery = removeOrigin(url);

    if (removeOrigin(window.location.href) === pathNameAndQuery) {
        return;
    }

    history.push(pathNameAndQuery);
};

export default {
    ...history,
    push,
};
