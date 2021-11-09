import { zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HalResource } from 'types';
import { hal, mediaTypes } from 'utils';
import actions from '../../actions';
import mediaType$ from '../mediaType';

const body$ = zip(actions.get.response, mediaType$).pipe(
    filter(([, mediaType]) => mediaType === mediaTypes.hal),
    map(([{ body }]) => hal.normalizeResource(body as HalResource)),
);

export default body$;
