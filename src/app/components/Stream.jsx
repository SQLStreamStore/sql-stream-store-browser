import React from 'react';
import { Observable as obs } from 'rxjs';
import { 
    Table, 
    TableBody, 
    TableRow, 
    TableHead, 
    TableCell
} from '@material-ui/core';
import { createState, connect } from '../reactive';
import { resolveLinks, preventDefault } from '../utils';
import { rels, actions, store } from '../stream-store';
import FormButtons from './FormButtons.jsx';
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

const forms$ = store.body$
    .filter(({ _embedded }) => _embedded)
    .map(({ _embedded }) => () => Object.keys(_embedded)
        .filter(rel => _embedded[rel].$schema && _embedded[rel].$schema.endsWith('hyper-schema#'))
        .reduce((akk, rel) => ({...akk, [rel]: _embedded[rel]}), {}));

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        messages$.map(messages => ['messages', messages]),
        forms$.map(forms => ['forms', forms])
    ),
    obs.of({ messages: [], links: {}, forms: {} }));

const nowrap = {whiteSpace: 'nowrap'};

const Message = ({ messageId, createdUtc, position, streamId, streamVersion, type, _links }) => (
    <TableRow>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{width: '100%'}}>
            <a onClick={preventDefault(() => actions.get.next(_links.self.href))} href="#">{streamId}@{streamVersion}</a>
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
                <TableCell style={{width: '100%'}}>Stream Id@Version</TableCell>
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

const onNavigate = href => actions.get.next(href);

const Stream = ({ links, messages, forms }) => (
    <section>
        <NavigationLinks 
            onNavigate={onNavigate}
            links={links}
        />
        <FormButtons
            forms={forms}
        />
        <Messages 
            messages={messages}
        />
    </section>);

Stream.defaultProps = {
    links: { }
};

export default connect(state$)(Stream);