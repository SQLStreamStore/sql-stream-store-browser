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


const Message = ({ messageId, createdUtc, position, streamId, streamVersion, type, _links }) => (
    <TableRow>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <a onClick={preventDefault(() => actions.get.next(_links.self.href))} href="#">{streamId}@{streamVersion}</a>
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