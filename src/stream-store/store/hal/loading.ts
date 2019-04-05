import { combineLatest, merge as observableMerge } from 'rxjs';
import { delay, map, timestamp } from 'rxjs/operators';
import actions from '../../actions';

const verbs = Object.keys(actions);

const requests$ = observableMerge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].request),
);

const responses$ = observableMerge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].response),
);

const delayedRequests$ = requests$.pipe(delay(1000));

const temp$ = requests$.pipe(timestamp());

const loading$ = combineLatest(
    temp$,
    responses$.pipe(timestamp()),
    delayedRequests$.pipe(timestamp()),
).pipe(
    map(
        ([
            { timestamp: requestTs },
            { timestamp: responseTs },
            { timestamp: delayedTs },
        ]) =>
            requestTs > responseTs &&
            delayedTs > responseTs &&
            delayedTs >= requestTs,
    ),
);

export default loading$;
