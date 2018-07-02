import React from 'react';
import { Observable as obs } from 'rxjs';
import { createState, connect } from '../../reactive';
import { resolveLinks, preventDefault } from '../../utils';
import { rels, store } from '../';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/StripeyTable';

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

const Message = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    links,
    onNavigate
}) => (
        <TableRow>
            <TableCell style={nowrap}>{messageId}</TableCell>
            <TableCell style={nowrap}>{createdUtc}</TableCell>
            <TableCell style={nowrap}>{type}</TableCell>
            <TableCell style={nowrap}>
                <a 
                    onClick={preventDefault(() => onNavigate(links[rels.feed].href))}
                    href={links[rels.feed].href}
                >
                    {streamId}
                </a>
            </TableCell>
            <TableCell>
                <a 
                    onClick={preventDefault(() => onNavigate(links.self.href))}
                    href={links.self.href}
                >
                    {streamId}@{streamVersion}
                </a>
            </TableCell>
            <TableCell>{position}</TableCell>
        </TableRow>);

const Messages = ({ messages, onNavigate }) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Message Id</TableCell>
                <TableCell>Created UTC</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Stream</TableCell>
                <TableCell>Stream Id@Version</TableCell>
                <TableCell numeric>Position</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {messages.map(message => (
                <Message
                    key={message.messageId}
                    onNavigate={onNavigate}
                    {...message}
            />))}
        </TableBody>
    </Table>);

Messages.defaultProps = {
    messages: []
};

const Stream = ({ links, messages, forms, onNavigate }) => (
    <section>
        <Messages
            messages={messages}
            onNavigate={onNavigate}
        />
    </section>);

Stream.defaultProps = {
    links: {}
};

export default connect(state$)(Stream);