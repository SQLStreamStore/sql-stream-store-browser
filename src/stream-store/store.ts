import { JSONSchema7 } from 'json-schema';
import { Observable as obs } from 'rxjs';
import { HalResource } from '../types';
import { resolveLinks } from '../utils';
import actions from './actions';

const mediaType$ = actions.get.response.map(
    ({ headers }) => headers['content-type'].split(';')[0],
);

const body$ = actions.get.response.map(({ body }) => body as HalResource);

const url$ = actions.get.response.map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => resolveLinks(url, _links || {}));

const isJsonSchema = (schema: JSONSchema7 & HalResource) =>
    schema.$schema && schema.$schema.endsWith('schema#');

const forms$ = body$.map(({ _embedded }) => _embedded || {}).map(embedded =>
    Object.keys(embedded)
        .filter(rel => isJsonSchema(embedded[rel]))
        .reduce(
            (akk, rel) => ({
                ...akk,
                [rel]: embedded[rel],
            }),
            // tslint:disable-next-line:no-object-literal-type-assertion
            {} as JSONSchema7,
        ),
);

const verbs = Object.keys(actions);

const requests$ = obs.merge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].request),
);

const responses$ = obs.merge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].response),
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
    body$,
    forms$,
    links$,
    loading$,
    mediaType$,
    url$,
};
