import resolve from 'resolve-relative-url';

export const getServerUrl = ({ query: { server } } = { query: { } }) => server;

export const getStreamId = ({ streamId } = { })  => streamId;

export const getStreamVersion = ({ streamVersion } = { }) => streamVersion;

export const resolveLinks = (url, links) => Object.keys(links)
    .reduce((prev, key) => ({...prev, [key]: {...links[key], href: resolve(links[key].href, url)}}), {});

export * as http from './http';