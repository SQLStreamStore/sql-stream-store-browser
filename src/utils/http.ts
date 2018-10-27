import { HttpRequest, HttpResponse } from '../types';
import mediaTypes from './mediaTypes';

declare global {
    interface Headers {
        entries: () => Iterable<string>;
    }
}

const isJson = (mediaType: string | undefined) =>
    mediaType === mediaTypes.json || (mediaType || '').endsWith('+json');

const getBody = async (
    response: Response,
    headers: { [key: string]: string },
) => {
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

const getHeaders = (headers: Headers) =>
    [...headers.entries()].reduce(
        (acc, [key, value]) =>
            value
                ? {
                      ...acc,
                      [key]: value,
                  }
                : acc,
        {},
    );

const mapResponse = async (response: Response): Promise<HttpResponse> => {
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

const get = ({ link, headers = {} }: HttpRequest) =>
    fetch(link.href, {
        headers: new Headers({
            accept: link.type || mediaTypes.any,
            ...headers,
        }),
    }).then(mapResponse);

interface HttpRequestWithBody extends HttpRequest {
    body: object;
}

const post = <TRequest extends object, TResponse extends object>({
    link,
    body,
    headers = {},
}: HttpRequestWithBody) =>
    fetch(link.href, {
        body: JSON.stringify(body),
        headers: new Headers({
            accept: link.type || mediaTypes.any,
            'content-type': mediaTypes.json,
            ...headers,
        }),
        method: 'post',
    }).then(mapResponse);

const _delete = ({ link, headers = {} }: HttpRequest) =>
    fetch(link.href, {
        headers: new Headers({
            accept: link.type || mediaTypes.any,
            ...headers,
        }),
        method: 'delete',
    }).then(mapResponse);

interface Http {
    get: (request: HttpRequest) => Promise<HttpResponse>;
    post: (request: HttpRequestWithBody) => Promise<HttpResponse>;
    delete: (request: HttpRequest) => Promise<HttpResponse>;
}

const http: Http = {
    delete: _delete,
    get,
    post,
};

export default http;
