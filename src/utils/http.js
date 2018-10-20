import mediaTypes from './mediaTypes';

const isJson = mediaType =>
    mediaType === mediaTypes.json || (mediaType || '').endsWith('+json');

const getBody = async (response, headers) => {
    const body = await response.text();
    if (!isJson(headers['content-type'])) {
        return body;
    }
    try {
        return JSON.parse(body);
    } catch (e) {
        return {};
    }
};

const getHeaders = headers =>
    [...headers.entries()].reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );

const mapResponse = async response => {
    const { ok, status, statusText, url } = response;

    const headers = getHeaders(response.headers);

    return {
        body: await getBody(response, headers),
        headers,
        ok,
        status,
        statusText,
        url,
    };
};

const get = ({ link, headers = {} }) =>
    fetch(link.href, {
        headers: new Headers({
            accept: link.type || mediaTypes.hal,
            ...headers,
        }),
    }).then(mapResponse);

const post = ({ link, body, headers = {} }) =>
    fetch(link.href, {
        headers: new Headers({
            'content-type': mediaTypes.json,
            accept: link.type || mediaTypes.hal,
            ...headers,
        }),
        method: 'post',
        body: JSON.stringify(body),
    }).then(mapResponse);

const _delete = ({ link, headers = {} }) =>
    fetch(link.href, {
        headers: new Headers({
            accept: link.type || mediaTypes.hal,
            ...headers,
        }),
        method: 'delete',
    }).then(mapResponse);

export default {
    get,
    post,
    delete: _delete,
};
