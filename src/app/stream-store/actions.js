import { createActions } from '../reactive';
import { http } from '../utils';

const actions = createActions(['get', 'getResponse']);

actions.get.flatMap(url => http.get(url)).subscribe(response => actions.getResponse.next(response));

export default actions;