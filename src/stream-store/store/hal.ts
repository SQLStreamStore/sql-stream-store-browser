import { JSONSchema7 } from 'json-schema';
import { Observable as obs } from 'rxjs';
import { HalLink, HalResource } from '../../types';
import { resolveLinks } from '../../utils';
import mediaTypes from '../../utils/mediaTypes';
import actions from '../actions';
import mediaType$ from './mediaType';

interface Links {
    [rel: string]: HalLink | HalLink[];
}

interface Embedded {
    [rel: string]: HalResource | HalResource[];
}

const normalizeEmbedded = (
    maybeArray: HalResource | HalResource[],
): HalResource[] => (Array.isArray(maybeArray) ? maybeArray : [maybeArray]);

const normalizeLinks = (maybeArray: HalLink | HalLink[]): HalLink[] =>
    Array.isArray(maybeArray) ? maybeArray : [maybeArray];

const normalize = ({
    _links,
    _embedded,
    ...resource
}: {
    _links: Links;
    _embedded: Embedded;
}): HalResource => ({
    ...resource,
    _embedded: Object.keys(_embedded || {}).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: normalizeEmbedded(_embedded[rel]).map(normalize),
        }),
        {},
    ),
    _links: Object.keys(_links || {}).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: normalizeLinks(_links[rel]),
        }),
        {},
    ),
});

const body$ = actions.get.response
    .zip(mediaType$)
    .filter(([body, mediaType]) => mediaType === mediaTypes.hal)
    .map(([{ body }]) => normalize(body as HalResource));

const url$ = actions.get.response.map(({ url }) => url);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => resolveLinks(url, _links));

const isJsonSchema = (schema: JSONSchema7 & HalResource) =>
    schema && schema.$schema && schema.$schema.endsWith('schema#');

const forms$ = body$.map(({ _embedded }) => _embedded).map(embedded =>
    Object.keys(embedded)
        .filter(rel => isJsonSchema(embedded[rel][0]))
        .reduce(
            (akk, rel) => ({
                ...akk,
                [rel]: embedded[rel][0],
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
