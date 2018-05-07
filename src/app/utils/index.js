import resolve from 'resolve-relative-url';
import qs from 'qs';

const parseQueryString = search => qs.parse(search, { ignoreQueryPrefix: true });

export const getServerUrl = ({ search } = { search: { } }) => parseQueryString(search).server;

export const getStreamId = ({ streamId } = { })  => streamId;

export const getStreamVersion = ({ streamVersion } = { }) => streamVersion;

export const resolveLinks = (url, links) => Object.keys(links)
    .reduce((prev, key) => ({...prev, [key]: {...links[key], href: resolve(links[key].href, url)}}), {});

export { default as history } from './history';

export { default as http } from './http';