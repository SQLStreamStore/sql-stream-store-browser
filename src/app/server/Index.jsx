import React from 'react';
import { Observable as obs } from 'rxjs';
import { Subheader } from 'material-ui';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';
import { http, getServerUrl } from '../utils'
import { createActions, createState, connect } from '../reactive';
import { mount } from '../components';

const actions = createActions(['get', 'getResponse']);

const body$ = actions.getResponse
    .map(({ body }) => body);

const links$ = body$
    .map(({ _links }) => () => _links);

const recent$ = body$
    .map(({ _embedded }) => () => _embedded.recent);

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        recent$.map(recent => ['recent', recent])
    ),
    obs.of({ recent: { streamIds: []}, links: {} })
);

actions.get.flatMap(url => http.get(url)).subscribe(response => actions.getResponse.next(response));

const RecentlyCreatedStreams = ({ streamIds, url }) => (
    <List>
        <Subheader>Recently Created Streams</Subheader>
        {streamIds.map(streamId => (
            <ListItem key={streamId}>
                <Link to={`/server/streams/${streamId}?url=${url}`}>{streamId}</Link>
            </ListItem>))}
    </List>);

const AllStream = ({ url }) => (
    <List>
        <ListItem><Link to={`/server/stream?url=${url}`}>All Stream</Link></ListItem>
    </List>);

const Index = ({ recent, location }) => (
    <section>
        <AllStream url={getServerUrl(location)} />
        <RecentlyCreatedStreams {...recent} url={getServerUrl(location)} />
    </section>);

export default mount(({ location }) => actions.get.next(getServerUrl(location)))(connect(state$)(Index));