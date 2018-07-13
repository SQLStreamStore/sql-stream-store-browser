import React from 'react';
import { Observable as obs } from 'rxjs';
import { List, ListItem } from '@material-ui/core';
import { createState, connect } from '../../reactive';
import rels from '../rels';
import store from '../store';
import { preventDefault } from '../../utils';
import { withAuthorization } from '../../components';

const links$ = store.links$.map(links => () => links);

const recent$ = store.body$
    .filter(({ _embedded }) => _embedded)
    .map(({ _embedded }) => () => _embedded.recent);

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        recent$.map(recent => ['recent', recent]),
    ),
    obs.of({ recent: { streamIds: [] }, links: {} }),
);

const relsToTitle = {
    [rels.feed]: 'All Stream',
};

const Links = withAuthorization(({ links, onNavigate, authorization }) => (
    <List>
        {Object.keys(links).map((rel, key) => (
            <ListItem key={key}>
                <a
                    href={links[rel].href}
                    onClick={preventDefault(() =>
                        onNavigate(links[rel].href, authorization),
                    )}
                >
                    {relsToTitle[rel]}
                </a>
            </ListItem>
        ))}
    </List>
));

Links.defaultProps = {
    links: [],
};

const Index = ({ links, onNavigate }) => (
    <section>
        <Links links={links} onNavigate={onNavigate} />
    </section>
);

export default connect(state$)(Index);
