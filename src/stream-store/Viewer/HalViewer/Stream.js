import React from 'react';
import { Observable as obs } from 'rxjs';
import { createState, connect } from '../../../reactive';
import { resolveLinks } from '../../../utils';
import rels from '../../rels';
import store from '../../store';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../../components/StripeyTable';
import { Hyperlink } from '../../../components';

const messages$ = store.body$
    .zip(store.url$)
    .map(([{ _embedded }, url]) => () =>
        _embedded[rels.message].map(({ _links, ...message }) => ({
            ...message,
            links: resolveLinks(url, _links),
        })),
    );

const state$ = createState(
    messages$.map(messages => ['messages', messages]),
    obs.of({ messages: [] }),
);

const nowrap = { whiteSpace: 'nowrap' };

const Message = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    links,
}) => (
    <TableRow>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={nowrap}>
            <Hyperlink link={links[rels.feed][0]}>{streamId}</Hyperlink>
        </TableCell>
        <TableCell>
            <Hyperlink link={links.self[0]}>
                {streamId}
                {'@'}
                {streamVersion}
            </Hyperlink>
        </TableCell>
        <TableCell>{position}</TableCell>
    </TableRow>
);

const Messages = ({ messages }) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>{'Message Id'}</TableCell>
                <TableCell>{'Created UTC'}</TableCell>
                <TableCell>{'Type'}</TableCell>
                <TableCell>{'Stream'}</TableCell>
                <TableCell>{'Stream Id@Version'}</TableCell>
                <TableCell numeric>{'Position'}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {messages.map(message => (
                <Message key={message.messageId} {...message} />
            ))}
        </TableBody>
    </Table>
);

Messages.defaultProps = {
    messages: [],
};

const Stream = ({ messages }) => (
    <section>
        <Messages messages={messages} />
    </section>
);

Stream.defaultProps = {
    messages: [],
};

export default connect(state$)(Stream);
