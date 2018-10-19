import mediaTypes from './mediaTypes';

const tryParseJson = body => {
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
    const { ok, status, statusText, url, headers } = response;

    return {
        body: tryParseJson(await response.text()),
        headers: getHeaders(headers),
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
