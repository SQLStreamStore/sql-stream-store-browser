import { createActions } from '../reactive';
import { http, history } from '../utils';

const actions = createActions([
    'get',
    'getResponse',
    'post',
    'postResponse',
    'delete',
    'deleteResponse'
]);

actions.get.flatMap(url => http.get(url)).subscribe(response => actions.getResponse.next(response));
actions.post.flatMap(request => http.post(request)).subscribe(response => actions.postResponse.next(response));
actions.delete.flatMap(request => http.delete(request)).subscribe(response => actions.deleteResponse.next(response));

actions.getResponse.subscribe(({ url }) => history.push(url));

const getUrl = location => `${location.pathname}${location.search}${location.hash}`;

history.listen((location, action) => action === 'POP' && actions.get.next(getUrl(location)));

export default actions;