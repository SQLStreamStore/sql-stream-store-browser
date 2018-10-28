import React, { ComponentType, CSSProperties, StatelessComponent } from 'react';
import { Observable as obs } from 'rxjs';
import { Hyperlink } from '../../../components';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '../../../components/StripeyTable';
import { connect, createState } from '../../../reactive';
import { HalLinks, HalResource } from '../../../types';
import { resolveLinks } from '../../../utils';
import rels from '../../rels';
import store from '../../store';
import { HalViewerProps } from './types';

interface Message {
    messageId: string;
    jsonData: any;
    createdUtc: string;
    position: number;
    streamId: string;
    streamVersion: number;
    type: string;
}

const messages$ = store.body$.zip(store.url$).map(([{ _embedded }, url]) =>
    ((_embedded || {})[rels.message] as HalResource & Message).map(
        ({ _links, ...message }) => ({
            ...message,
            _links: resolveLinks(url, _links),
        }),
    ),
);

const state$ = createState<StreamState>(
    messages$.map(messages => ['messages', () => messages]),
    obs.of({ messages: [] }),
);

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

const Message = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    _links,
}: Message & HalResource) => (
    <TableRow>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={nowrap}>
            <Hyperlink link={(_links as HalLinks)[rels.feed][0]}>
                {streamId}
            </Hyperlink>
        </TableCell>
        <TableCell>
            <Hyperlink link={(_links as HalLinks).self[0]}>
                {streamId}
                {'@'}
                {streamVersion}
            </Hyperlink>
        </TableCell>
        <TableCell>{position}</TableCell>
    </TableRow>
);

interface MessagesState {
    messages: Array<Message & HalResource>;
}

const Messages: StatelessComponent<MessagesState> = ({ messages }) => (
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

interface StreamState {
    messages: Array<Message & HalResource>;
}

const Stream: StatelessComponent<StreamState> = ({ messages = [] }) => (
    <section>
        <Messages messages={messages} />
    </section>
);

export default connect(state$)(Stream) as ComponentType<HalViewerProps>;
