import { map } from 'rxjs/operators';
import actions from '../../actions';

const url$ = actions.get.response.pipe(map(({ url }) => url));

export default url$;
