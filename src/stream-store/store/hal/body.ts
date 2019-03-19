import { HalResource } from '../../../types';
import { hal, mediaTypes } from '../../../utils';
import actions from '../../actions';
import mediaType$ from '../mediaType';

const body$ = actions.get.response
    .zip(mediaType$)
    .filter(([, mediaType]) => mediaType === mediaTypes.hal)
    .map(([{ body }]) => hal.normalizeResource(body as HalResource));

export default body$;
