import { hal } from './../../../utils';
import body$ from './body';
import url$ from './url';

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => hal.resolveLinks(url, _links));

export default links$;
