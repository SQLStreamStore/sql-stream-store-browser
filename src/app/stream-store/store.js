import { resolveLinks } from '../utils';
import actions from './actions';

const body$ = actions.getResponse
    .map(({ body }) => body);

const url$ = actions.getResponse
    .map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => () => resolveLinks(url, _links))

export default {
    links$,
    body$,
    url$
};