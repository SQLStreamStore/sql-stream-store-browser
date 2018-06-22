import { createActions } from '../reactive';
import { http, history } from '../utils';

const actions = createActions([
    'get',
    'getResponse',
    'post',
    'postResponse'
]);

actions.get.flatMap(url => http.get(url)).subscribe(response => actions.getResponse.next(response));
actions.post.flatMap(request => http.post(request)).subscribe(response => actions.postResponse.next(response));

actions.getResponse.subscribe(({ url }) => history.push(url));

history.listen((location, action) => {
    if (action !== 'POP') {
        return;
    }

    const url = location.pathname.substr(1);

    if (!url) {
        return;
    }

    actions.get.next(url);
});


export default actions;