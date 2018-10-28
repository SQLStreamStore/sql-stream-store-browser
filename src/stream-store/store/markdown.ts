import mediaTypes from '../../utils/mediaTypes';
import actions from '../actions';
import mediaType$ from './mediaType';

const body$ = actions.get.response
    .zip(mediaType$)
    .filter(([body, mediaType]) => mediaType === mediaTypes.markdown)
    .map(([{ body }]) => body);

export default {
    body$,
};
