const tryParseJson = body => {
	try {
		return JSON.parse(body);
	}
	catch(e) {
		return body;
	}

};

const mapResponse = ({ ok, status, statusText, url }, body) => ({
    body: tryParseJson(body),
    ok,
    status,
    statusText,
    url
});

export const get = url => fetch(url)
    .then(response => response.text()
        .then(body => mapResponse(response, body)));