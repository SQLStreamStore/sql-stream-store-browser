import { Table, TableBody } from 'components/StripeyTable';
import React, { ComponentType, StatelessComponent } from 'react';
import { connect, createState } from 'reactive';
import { Observable as obs } from 'rxjs';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalResource } from 'types';
import { hal } from 'utils';
import { StreamHeader, StreamMessageDetails } from './components';
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

interface MessagesState {
    messages: Array<Message & HalResource>;
}

const Messages: StatelessComponent<MessagesState> = ({ messages }) => (
    <Table>
        <StreamHeader />
        <TableBody>
            {messages.map(message => (
                <StreamMessageDetails key={message.messageId} {...message} />
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

export default connect<StreamState, HalViewerProps>(state$)(Stream);
