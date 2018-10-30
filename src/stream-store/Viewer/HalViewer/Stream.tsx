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
import { HalResource } from '../../../types';
import { hal } from '../../../utils';
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

const messages$ = store.hal$.body$
    .zip(store.hal$.url$)
    .map(([{ _embedded }, url]) =>
        _embedded[rels.message].map(({ _links, ...message }) => ({
            ...message,
            _links: hal.resolveLinks(url, _links),
        })),
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
            <Hyperlink _links={_links} rel={rels.feed} />
        </TableCell>
        <TableCell>
            <Hyperlink _links={_links} rel={rels.self} />
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

const Stream: ComponentType<StreamState & HalViewerProps> = ({
    messages = [],
}) => (
    <section>
        <Messages messages={messages} />
    </section>
);

export default connect<HalViewerProps, StreamState>(state$)(Stream);
