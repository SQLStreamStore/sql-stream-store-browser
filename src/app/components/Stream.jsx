import React from 'react';
import { Observable as obs } from 'rxjs';
import { createState, connect } from '../reactive';
import { resolveLinks, preventDefault } from '../utils';
import { rels, actions, store } from '../stream-store';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from './StripeyTable';

const messages$ = store.body$
    .zip(store.url$)
    .map(([{ _embedded }, url]) => () => _embedded[rels.message]
        .map(({ _links, ...message }) => ({
            ...message,
            links: resolveLinks(url, _links)
        })));

const state$ = createState(
    messages$.map(messages => ['messages', messages]),
    obs.of({ messages: [] }));

const nowrap = { whiteSpace: 'nowrap' };

const onNavigate = href => actions.get.next(href);

const Message = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    links
}) => (
        <TableRow>
            <TableCell style={nowrap}>{messageId}</TableCell>
            <TableCell style={nowrap}>{createdUtc}</TableCell>
            <TableCell style={nowrap}>{type}</TableCell>
            <TableCell style={nowrap}>
                <a onClick={preventDefault(() => actions.get.next(links[rels.feed].href))} href="#">{streamId}</a>
            </TableCell>
            <TableCell style={{ width: '100%' }}>
                <a onClick={preventDefault(() => actions.get.next(links.self.href))} href="#">{streamId}@{streamVersion}</a>
            </TableCell>
            <TableCell>{position}</TableCell>
        </TableRow>);

const Messages = ({ messages }) => (
    <Table
        style={{ tableLayout: 'auto' }}
    >
        <TableHead>
            <TableRow>
                <TableCell>Message Id</TableCell>
                <TableCell>Created UTC</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Stream</TableCell>
                <TableCell style={{ width: '100%' }}>Stream Id@Version</TableCell>
                <TableCell numeric>Position</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {messages.map(message => (<Message key={message.messageId} {...message} />))}
        </TableBody>
    </Table>);

Messages.defaultProps = {
    messages: []
};

const Stream = ({ links, messages, forms }) => (
    <section>
        <Messages
            messages={messages}
        />
    </section>);

Stream.defaultProps = {
    links: {}
};

export default connect(state$)(Stream);