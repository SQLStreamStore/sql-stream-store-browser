import { Observable as obs } from 'rxjs';
import actions from '../../actions';

const verbs = Object.keys(actions);

const requests$ = obs.merge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].request),
);

const responses$ = obs.merge(
    ...verbs.map((verb: keyof typeof actions) => actions[verb].response),
);

const delayedRequests$ = requests$.delay(1000);

const loading$ = requests$
    .timestamp()
    .combineLatest(
        responses$.timestamp(),
        delayedRequests$.timestamp(),
        (
            { timestamp: requestTs },
            { timestamp: responseTs },
            { timestamp: delayedTs },
        ) =>
            requestTs > responseTs &&
            delayedTs > responseTs &&
            delayedTs >= requestTs,
    );

export default loading$;
