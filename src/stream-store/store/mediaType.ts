import { map } from 'rxjs/operators';
import actions from 'stream-store/actions';

const getMediaType = (headers: { [key: string]: string }) =>
    headers['content-type'].split(';')[0];

const mediaType$ = actions.get.response.pipe(
    map(({ headers }) => getMediaType(headers)),
);

export default mediaType$;
