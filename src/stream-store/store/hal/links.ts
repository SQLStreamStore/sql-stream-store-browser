import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { hal } from 'utils';
import body$ from './body';
import url$ from './url';

const links$ = zip(body$, url$).pipe(
    map(([{ _links }, url]) => hal.resolveLinks(url, _links)),
);

export default links$;
