import React from 'react';
import urljoin from 'url-join';
import { Observable as obs } from 'rxjs';
import { 
    Table, 
    TableBody, 
    TableRow, 
    TableRowColumn, 
    TableHeader, 
    TableHeaderColumn,
    Dialog } from 'material-ui';
import { Link } from 'react-router';
import { createActions, createState, connect } from '../reactive';
import { getServerUrl, http } from '../utils';
import NavigationLinks from './NavigationLinks.jsx';
import mount from './mount';

const actions = createActions(['get', 'getResponse']);

const body$ = actions.getResponse
    .map(({ body }) => body);

const links$ = body$
    .map(({ _links }) => () => _links);

const messages$ = body$
    .map(({ _embedded }) => () => _embedded['streamStore:message']);

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        messages$.map(messages => ['messages', messages])
    ),
    obs.of({ messages: [], links: {} }));

actions.get.flatMap(url => http.get(url)).subscribe(response => actions.getResponse.next(response));

const Message = ({ messageId, createdUtc, payload, position, streamId, streamVersion, type, _links, url }) => (
    <TableRow>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <Link rel='self' to={`/server/streams/${streamId}/${streamVersion}?url=${url}`}>{streamId}@{streamVersion}</Link>
        </TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
    </TableRow>);

const Messages = ({ messages, url }) => (
    <Table selectable={false} fixedHeader={false} style={{ tableLayout: 'auto' }}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                <TableHeaderColumn>Message Id</TableHeaderColumn>
                <TableHeaderColumn>Created UTC</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn style={{width: '100%'}}>Stream Id@Version</TableHeaderColumn>
                <TableHeaderColumn>Position</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true}>
            {messages.map(message => (<Message key={message.messageId} {...message} url={url} />))}
        </TableBody>
    </Table>);

Messages.defaultProps = {
    messages: []
};

const Stream = ({ links, messages, location }) => (
    <section>
        <NavigationLinks 
            onNavigate={pathAndQuery => actions.get.next(urljoin(getServerUrl(location), pathAndQuery))}
            links={links} />
        <Messages messages={messages} url={getServerUrl(location)} />
    </section>);

Stream.defaultProps = {
    links: { }
};

export default getBookmark => mount(props => actions.get.next(getBookmark(props)))(connect(state$)(Stream));