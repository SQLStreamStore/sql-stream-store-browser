import { createAction } from './../../../reactive';
import { Observable } from 'rxjs';
import rels from './../../../stream-store/rels';
import uriTemplate from 'uri-template';
import links$ from './links';

const isPotentialStreamId = (data: any) =>
    typeof data === 'number' || typeof data === 'string';

const clickPotentialStreamId = createAction<any>().filter(
    isPotentialStreamId,
) as Observable<number | string>;

const pattern$ = Observable.merge(
    clickPotentialStreamId.map(pattern => pattern),
    clickPotentialStreamId.map(pattern => String(pattern).replace(/-/g, '')),
).distinct();

const template$ = links$
    .filter(links => !!links[rels.browse])
    .map(links => links[rels.browse][0])
    .map(link => uriTemplate.parse(decodeURI(link.href)));

pattern$.combineLatest(template$, (p, template) => ({
    headers: { authorization: '' },
    link: {
        href: template.expand({ p, t: 'e' }),
    },
}));
