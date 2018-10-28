import actions from '../actions';

const getMediaType = (headers: { [key: string]: string }) =>
    headers['content-type'].split(';')[0];

const mediaType$ = actions.get.response.map(({ headers }) =>
    getMediaType(headers),
);

export default mediaType$;
