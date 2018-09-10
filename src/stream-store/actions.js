import { createAction } from '../reactive';
import { http, history } from '../utils';

const verbs = Object.keys(http);

const actions = verbs.reduce(
    (akk, verb) => ({
        ...akk,
        [verb]: {
            request: createAction(),
            response: createAction(),
        },
    }),
    {},
);

verbs.forEach(verb =>
    actions[verb].request
        .flatMap(request => http[verb](request))
        .subscribe(response => actions[verb].response.next(response)),
);

actions.get.response.subscribe(({ url }) => history.push(url));

const getUrl = location =>
    `${location.pathname}${location.search}${location.hash}`;

history.listen(
    (location, action) =>
        action === 'POP' &&
        actions.get.response.next({ url: getUrl(location) }),
);

export default actions;
