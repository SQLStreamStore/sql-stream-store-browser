import { Observable as obs } from 'rxjs';
import { resolveLinks } from '../utils';
import actions from './actions';

const mediaType$ = actions.get.response.map(
    ({ headers }) => headers['content-type'].split(';')[0],
);

const body$ = actions.get.response.map(({ body }) => body);

const url$ = actions.get.response.map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => resolveLinks(url, _links || {}));

const forms$ = body$.map(({ _embedded }) =>
    Object.keys(_embedded || {})
        .filter(
            rel =>
                _embedded[rel].$schema &&
                _embedded[rel].$schema.endsWith('schema#'),
        )
        .reduce((akk, rel) => ({ ...akk, [rel]: _embedded[rel] }), {}),
);

const verbs = Object.keys(actions);

const requests$ = obs.merge(...verbs.map(verb => actions[verb].request));

const responses$ = obs.merge(...verbs.map(verb => actions[verb].response));

const delayedRequests$ = requests$.delay(1000);

const loading$ = requests$
    .timestamp()
    .combineLatest(
        responses$.timestamp(),
        delayedRequests$.timestamp(),
        (
            { timestamp: requestTs },
            { timestamp: responseTs },
            { timestamp: delayedTs },
        ) =>
            requestTs > responseTs &&
            delayedTs > responseTs &&
            delayedTs >= requestTs,
    );

export default {
    links$,
    forms$,
    body$,
    url$,
    loading$,
    mediaType$,
};
