import resolve from 'resolve-relative-url';
import qs from 'qs';

const parseQueryString = search => qs.parse(search, { ignoreQueryPrefix: true });

export const getServerUrl = ({ search } = { search: { } }) => parseQueryString(search).server;

export const getStreamId = ({ streamId } = { })  => streamId;

export const getStreamVersion = ({ streamVersion } = { }) => streamVersion;

export const resolveLinks = (url, links) => Object
    .keys(links)
    .reduce((prev, rel) => ({
        ...prev, 
        [rel]: {
            ...links[rel], 
            rel,
            href: resolve(links[rel].href, url)
        }
    }), {});

export { default as history } from './history';

export { default as http } from './http';