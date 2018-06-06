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

const links$ = store.links$
    .map(links => () => links);

const message$ = store.body$
    .map(({ payload, ...body }) => () => ({ ...body, payload: tryParseJson(payload) }));

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
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

const StreamMessageDetails = ({ messageId, createdUtc, position, streamId, streamVersion, type, links }) => (
    <TableRow>
        <TableRowColumn>
            <a onClick={() => actions.get.next(links["streamStore:feed"].href)} href="#">{streamId}</a>
        </TableRowColumn>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <a onClick={() => actions.get.next(links.self.href)} href="#">{streamId}@{streamVersion}</a>
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
                <StreamMessageDetails {...message} links={links} />
            </TableBody>
        </Table>
        <StreamMessagePayload payload={message.payload} />
    </section>);

export default connect(state$)(StreamMessage);