import { Action, Location } from 'history';
import { ReplaySubject } from 'rxjs';
import { createAction } from './../reactive';
import { HttpRequest, HttpResponse } from './../types';
import { history, http } from './../utils';

type Actions = {
    [P in keyof typeof http]: {
        request: ReplaySubject<HttpRequest>;
        response: ReplaySubject<HttpResponse>;
    }
};

type HttpVerb = keyof typeof http;

const verbs: HttpVerb[] = Object.keys(http) as HttpVerb[];

const actions: Actions = verbs.reduce(
    (akk, verb: keyof typeof http) => ({
        ...akk,
        [verb]: {
            request: createAction(),
            response: createAction(),
        },
    }),
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as Actions,
);

verbs.forEach(verb =>
    actions[verb].request
        .flatMap(request => http[verb](request))
        .subscribe(response => actions[verb].response.next(response)),
);

actions.get.response.subscribe(({ url }) => history.push(url));

const getUrl = (location: Location) =>
    `${location.pathname}${location.search}${location.hash}`;

history.listen(
    (location: Location, action: Action): void => {
        if (action !== 'POP') {
            return;
        }
        actions.get.request.next({
            headers: {},
            link: { href: getUrl(location) },
        });
    },
);

export default actions;
