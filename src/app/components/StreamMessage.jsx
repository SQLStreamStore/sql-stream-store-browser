import React from 'react';
import urljoin from 'url-join';
import { Observable as obs } from 'rxjs';
import { 
    Card,
    CardText,
    Table, 
    TableBody, 
    TableRow, 
    TableRowColumn, 
    TableHeader, 
    TableHeaderColumn
    } from 'material-ui';
import { Link } from 'react-router-dom';

import { createState, connect } from '../reactive';
import { getServerUrl } from '../utils';
import { actions, store } from '../stream-store';
import NavigationLinks from './NavigationLinks.jsx';
import mount from './mount';

const tryParseJson = payload => {
    try {
        return JSON.parse(payload);
    }
    catch(e) {
        return payload;
    }
};


const message$ = store.body$
    .map(({ payload, ...body }) => () => ({ ...body, payload: tryParseJson(payload) }));

const state$ = createState(
    obs.merge(
        store.links$.map(links => ['links', links]),
        message$.map(message => ['message', message])
    ),
    obs.of({ message: {}, links: {} }));

const StreamMessageHeader = () => (
    <TableRow>
        <TableHeaderColumn>StreamId</TableHeaderColumn>
        <TableHeaderColumn>Message Id</TableHeaderColumn>
        <TableHeaderColumn>Created UTC</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn style={{width: '100%'}}>Stream Id@Version</TableHeaderColumn>
        <TableHeaderColumn>Position</TableHeaderColumn>
    </TableRow>);

const StreamMessageDetails = ({ messageId, createdUtc, position, streamId, streamVersion, type, server }) => (
    <TableRow>
        <TableRowColumn>
            <Link to={`/server/streams/${streamId}?server=${server}`}>{streamId}</Link>
        </TableRowColumn>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <Link rel='self' to={`/server/streams/${streamId}/${streamVersion}?server=${server}`}>{streamId}@{streamVersion}</Link>
        </TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
    </TableRow>);

const StreamMessagePayload = ({ payload }) => (
    <Card>
        <CardText><pre>{JSON.stringify(payload, null, 4)}</pre></CardText>
    </Card>);

const StreamMessage = ({ message, links, location }) => (
    <section>
        <NavigationLinks 
            onNavigate={url => actions.get.next(url)}
            links={links} />
        <Table selectable={false} fixedHeader={false} style={{ tableLayout: 'auto' }}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <StreamMessageHeader />
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows>
                <StreamMessageDetails {...message} server={getServerUrl(location)} />
            </TableBody>
        </Table>
        <StreamMessagePayload payload={message.payload} />
    </section>);

export default getBookmark => mount(props => actions.get.next(getBookmark(props)))(connect(state$)(StreamMessage));