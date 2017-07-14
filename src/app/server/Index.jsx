import React from 'react';
import { Observable as obs } from 'rxjs';
import { Subheader } from 'material-ui';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import { http, getServerUrl, resolveLinks } from '../utils'
import { createActions, createState, connect } from '../reactive';
import { mount } from '../components';

const actions = createActions(['get', 'getResponse']);

const url$ = actions.getResponse
    .map(({ url }) => url);

const body$ = actions.getResponse
    .map(({ body }) => body);

const links$ = body$
    .zip(url$)
    .map(([{ _links }, url]) => () => resolveLinks(url, _links));

const recent$ = body$
    .filter(({ _embedded }) => _embedded)
    .map(({ _embedded }) => () => _embedded.recent);

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        recent$.map(recent => ['recent', recent])
    ),
    obs.of({ recent: { streamIds: []}, links: {} })
);

actions.get.flatMap(url => http.get(url)).subscribe(url => actions.getResponse.next(url));

const relsToTitle = {
    'streamStore:stream': 'All Stream'
};

const relsToRoute = {
    'streamStore:stream': '/server/stream'
};

const Links = ({ links, server }) => (
    <List>
        {Object.keys(links).map((rel, key) => (
            <ListItem key={key}>
                <Link to={`${relsToRoute[rel]}?server=${server}`}>{relsToTitle[rel]}</Link>
            </ListItem>
        ))}
    </List>);

const Index = ({ recent, location, links }) => (
    <section>
        <Links links={links} server={getServerUrl(location)} />
    </section>);

export default mount(({ location }) => actions.get.next(getServerUrl(location)))(connect(state$)(Index));