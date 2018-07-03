import resolve from 'resolve-relative-url';

export const resolveLinks = (url, links) => Object
    .keys(links)
    .reduce((akk, rel) => ({
        ...akk,
        [rel]: {
            ...links[rel],
            rel,
            href: resolve(links[rel].href, url),
        },
    }), {});

export { default as history } from './history';

export { default as http } from './http';

export { default as preventDefault } from './preventDefault';
