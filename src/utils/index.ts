import { resolve } from 'uri-js';
import { HalLinks } from '../types';

export const resolveLinks = (url: string, links: HalLinks): HalLinks =>
    Object.keys(links).reduce(
        (akk, rel) => ({
            ...akk,
            [rel]: links[rel].map(({ href, ...link }) => ({
                ...link,
                href: resolve(url, href || './', { tolerant: true }),
                rel,
            })),
        }),
        // tslint:disable-next-line:no-object-literal-type-assertion
        {} as HalLinks,
    );

export { default as history } from './history';

export { default as http } from './http';

export { default as preventDefault } from './preventDefault';

export { default as mediaTypes } from './mediaTypes';
