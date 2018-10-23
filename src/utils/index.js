import { resolve } from 'uri-js';

const toArray = maybeArray =>
    !!maybeArray && Array.isArray(maybeArray) ? maybeArray : [maybeArray];

export const resolveLinks = (url, links) =>
    Object.keys(links).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: toArray(links[rel]).map(({ href, ...link }) => ({
                ...link,
                rel,
                href: resolve(url, href || './', { tolerant: true }),
            })),
        }),
        {},
    );

export { default as history } from './history';

export { default as http } from './http';

export { default as preventDefault } from './preventDefault';

export { default as mediaTypes } from './mediaTypes';
