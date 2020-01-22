import URL from 'url';
import { HalLink, HalLinks, HalResource } from './../types';

const resolveLinks = (url: string, links: HalLinks): HalLinks =>
    Object.keys(links).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: links[rel].map(({ href, ...link }) => ({
                ...link,
                href: URL.resolve(url, href || './'),
                rel,
            })),
        }),
        // tslint:disable-next-line:no-object-literal-type-assertion
        {} as HalLinks,
    );

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

const normalizeResource = ({
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
            [rel]: normalizeEmbedded(_embedded[rel]).map(normalizeResource),
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

export default {
    normalizeResource,
    resolveLinks,
};
