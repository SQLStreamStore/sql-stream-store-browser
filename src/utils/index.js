import { resolve } from 'uri-js';

export const resolveLinks = (url, links) =>
    Object.keys(links).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: {
                ...links[rel],
                rel,
                href: resolve(url, links[rel].href),
            },
        }),
        {},
    );

export { default as history } from './history';

export { default as http } from './http';

export { default as preventDefault } from './preventDefault';

export { default as mediaTypes } from './mediaTypes';
