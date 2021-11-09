import { Table } from 'components';
import React, { ComponentType, FunctionComponent } from 'react';
import { connect, createState } from 'reactive';
import { of as observableOf, zip } from 'rxjs';
import { map } from 'rxjs/operators';
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

const messages$ = zip(store.hal$.body$, store.hal$.url$).pipe(
    map(([{ _embedded }, url]) =>
        _embedded[rels.message].map(({ _links, ...message }) => ({
            ...message,
            _links: hal.resolveLinks(url, _links),
        })),
    ),
);

const state$ = createState<StreamState>(
    messages$.pipe(map(messages => ['messages', () => messages])),
    observableOf({ messages: [] }),
);

interface MessagesState {
    messages: Array<Message & HalResource>;
}

const Messages: FunctionComponent<MessagesState> = ({ messages }) => (
    <Table>
        <StreamHeader />
        <Table.Body>
            {messages.map(message => (
                <StreamMessageDetails key={message.messageId} {...message} />
            ))}
        </Table.Body>
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
