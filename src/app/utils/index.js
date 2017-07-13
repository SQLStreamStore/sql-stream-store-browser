export const getServerUrl = ({ query: { url } } = { query: { } }) => url;

export const getStreamId = ({ streamId } = { })  => streamId;

export const getStreamVersion = ({ streamVersion } = { }) => streamVersion;

export * as http from './http';