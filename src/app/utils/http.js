const mapResponse = (response, body) => {
    const { ok, status, statusText } = response;

    return {
        body: JSON.parse(body),
        ok,
        status,
        statusText
    };
};

export const get = url => fetch(url)
    .then(response => response.text()
        .then(body => mapResponse(response, body)));