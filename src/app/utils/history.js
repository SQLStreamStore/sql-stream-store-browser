import { createHashHistory } from 'history';

const history = createHashHistory({
    hashType: 'noslash'
});

const push = url => {
    const pathname = `/${url}`;

    if (history.location.pathname === pathname) {
        return;
    }

    history.push(pathname);
};

export default {
    ...history,
    push
};