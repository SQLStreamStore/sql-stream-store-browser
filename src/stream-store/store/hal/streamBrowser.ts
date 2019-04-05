import { createAction } from 'reactive';
import { merge as observableMerge, Observable } from 'rxjs';
import { combineLatest, distinct, filter, map } from 'rxjs/operators';
import rels from 'stream-store/rels';
import uriTemplate from 'uri-template';
import links$ from './links';

const isPotentialStreamId = (data: any) =>
    typeof data === 'number' || typeof data === 'string';

const clickPotentialStreamId = createAction<any>().pipe(
    filter(isPotentialStreamId),
) as Observable<number | string>;

const pattern$ = observableMerge(
    clickPotentialStreamId.pipe(map(pattern => pattern)),
    clickPotentialStreamId.pipe(
        map(pattern => String(pattern).replace(/-/g, '')),
    ),
).pipe(distinct());

const template$ = links$.pipe(
    filter(links => !!links[rels.browse]),
    map(links => links[rels.browse][0]),
    map(link => uriTemplate.parse(decodeURI(link.href))),
);

pattern$.pipe(
    combineLatest(template$, (p, template) => ({
        headers: { authorization: '' },
        link: {
            href: template.expand({ p, t: 'e' }),
        },
    })),
);
