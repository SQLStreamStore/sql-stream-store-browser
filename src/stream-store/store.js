import { Observable as obs } from 'rxjs';
import { resolveLinks } from '../utils';
import actions from './actions';

const body$ = actions.getResponse.map(({ body }) => body);

const url$ = actions.getResponse.map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => resolveLinks(url, _links || {}));

const forms$ = body$.map(({ _embedded }) =>
    Object.keys(_embedded || {})
        .filter(
            rel =>
                _embedded[rel].$schema &&
                _embedded[rel].$schema.endsWith('hyper-schema#'),
        )
        .reduce((akk, rel) => ({ ...akk, [rel]: _embedded[rel] }), {}),
);

const requests$ = obs.merge(actions.get, actions.post, actions.delete);

const responses$ = obs.merge(
    actions.getResponse,
    actions.postResponse,
    actions.deleteResponse,
);

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
};
