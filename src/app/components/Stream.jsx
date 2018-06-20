import React from 'react';
import { Observable as obs } from 'rxjs';
import { 
    Table, 
    TableBody, 
    TableRow, 
    TableRowColumn, 
    TableHeader, 
    TableHeaderColumn
} from 'material-ui';
import { createState, connect } from '../reactive';
import { resolveLinks } from '../utils';
import { rels, actions, store } from '../stream-store';
import NavigationLinks from './NavigationLinks.jsx';

const links$ = store.links$
    .map(links => () => links);

const messages$ = store.body$
    .zip(store.url$)
    .map(([{ _embedded }, url]) => () => _embedded[rels.message]
        .map(({ _links, ...message }) => ({
            ...message,
            _links: resolveLinks(url, _links)
        })));

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        messages$.map(messages => ['messages', messages])
    ),
    obs.of({ messages: [], links: {} }));


const Message = ({ messageId, createdUtc, position, streamId, streamVersion, type, _links }) => (
    <TableRow>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <a onClick={() => actions.get.next(_links.self.href)} href="#">{streamId}@{streamVersion}</a>
        </TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
    </TableRow>);

const Messages = ({ messages }) => (
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
        <TableBody displayRowCheckbox={false} stripedRows>
            {messages.map(message => (<Message key={message.messageId} {...message} />))}
        </TableBody>
    </Table>);

Messages.defaultProps = {
    messages: []
};

const onNavigate = href => actions.get.next(href);

const Stream = ({ links, messages }) => (
    <section>
        <NavigationLinks 
            onNavigate={onNavigate}
            links={links} />
        <Messages messages={messages} />
    </section>);

Stream.defaultProps = {
    links: { }
};

export default connect(state$)(Stream);