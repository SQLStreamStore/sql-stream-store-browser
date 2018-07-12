import React from 'react';
import PropTypes from 'prop-types';
import { Observable as obs } from 'rxjs';
import { createState, connect } from '../../reactive';
import { resolveLinks, preventDefault } from '../../utils';
import { withAuthorization } from '../../components'
import rels from '../rels';
import store from '../store';
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
            links: resolveLinks(url, _links),
        })));

const state$ = createState(
    messages$.map(messages => ['messages', messages]),
    obs.of({ messages: [] }),
);

const nowrap = { whiteSpace: 'nowrap' };

const messagePropType = {
    messageId: PropTypes.string.isRequired,
    createdUtc: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    streamId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

const Message = withAuthorization(({
    authorization,
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    links,
    onNavigate,
}) => (
    <TableRow>
        <TableCell
            style={nowrap}
        >
            {messageId}
        </TableCell>
        <TableCell style={nowrap}>
            {createdUtc}
        </TableCell>
        <TableCell style={nowrap}>
            {type}
        </TableCell>
        <TableCell style={nowrap}>
            <a
                onClick={preventDefault(() => onNavigate(links[rels.feed].href, authorization))}
                href={links[rels.feed].href}
            >
                {streamId}
            </a>
        </TableCell>
        <TableCell>
            <a
                onClick={preventDefault(() => onNavigate(links.self.href, authorization))}
                href={links.self.href}
            >
                {streamId}
                {'@'}
                {streamVersion}
            </a>
        </TableCell>
        <TableCell>
            {position}
        </TableCell>
    </TableRow>));

Message.propTypes = {
    onNavigate: PropTypes.func.isRequired,
    ...PropTypes.shape(messagePropType),
};
const Messages = ({ messages, onNavigate }) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>
                    {'Message Id'}
                </TableCell>
                <TableCell>
                    {'Created UTC'}
                </TableCell>
                <TableCell>
                    {'Type'}
                </TableCell>
                <TableCell>
                    {'Stream'}
                </TableCell>
                <TableCell>
                    {'Stream Id@Version'}
                </TableCell>
                <TableCell numeric>
                    {'Position'}
                </TableCell>
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

Messages.propTypes = {
    onNavigate: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape(messagePropType)),
};

Messages.defaultProps = {
    messages: [],
};

const Stream = ({
    messages,
    onNavigate,
}) => (
    <section>
        <Messages
            messages={messages}
            onNavigate={onNavigate}
        />
    </section>);

Stream.propTypes = {
    onNavigate: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape(messagePropType)),
};

Stream.defaultProps = {
    messages: [],
};

export default connect(state$)(Stream);
