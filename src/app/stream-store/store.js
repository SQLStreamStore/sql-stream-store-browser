import { resolveLinks } from '../utils';
import actions from './actions';

const body$ = actions.getResponse
    .map(({ body }) => body);

const url$ = actions.getResponse
    .map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => resolveLinks(url, _links));

const forms$ = body$
    .filter(({ _embedded }) => _embedded)
    .map(({ _embedded }) => Object.keys(_embedded)
        .filter(rel => _embedded[rel].$schema && _embedded[rel].$schema.endsWith('hyper-schema#'))
        .reduce((akk, rel) => ({ ...akk, [rel]: _embedded[rel] }), {}));

export default {
    links$,
    forms$,
    body$,
    url$,
};
