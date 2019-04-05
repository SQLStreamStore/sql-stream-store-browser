import { zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import actions from 'stream-store/actions';
import { mediaTypes } from 'utils';
import mediaType$ from './mediaType';

const body$ = zip(actions.get.response, mediaType$).pipe(
    filter(([, mediaType]) => mediaType === mediaTypes.markdown),
    map(([{ body }]) => body),
);

export default {
    body$,
};
