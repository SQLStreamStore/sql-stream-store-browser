import {
    Card,
    CardActions,
    CardContent,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import { Table } from 'components';
import { Notes, Settings } from 'icons';
import React, { ComponentType, FormEvent, PureComponent } from 'react';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import store from 'stream-store/store';
import { HalResource } from 'types';
import { JsonViewer, StreamHeader, StreamMessageDetails } from './components';
import { HalViewerProps } from './types';

const message$ = store.hal$.body$.pipe(
    map(({ payload, metadata, ...body }) => ({
        ...body,
        metadata,
        payload,
    })),
);

interface StreamMessageState extends HalResource {
    message: {
        messageId: string;
        createdUtc: string;
        position: number;
        streamId: string;
        streamVersion: number;
        type: string;
        payload: object;
        metadata?: object;
    };
}

const state$ = createState<StreamMessageState>(
    message$.pipe(map(message => ['message', () => message])),
    observableOf<StreamMessageState>({
        _embedded: {},
        _links: {},
        message: {
            createdUtc: '',
            messageId: '',
            metadata: {},
            payload: {},
            position: 0,
            streamId: '',
            streamVersion: 0,
            type: '',
        },
    }),
);

interface StreamMessageTabsState {
    value: number;
}

interface StreamMessageTabsProps {
    message: {
        payload: object;
        metadata?: object;
    };
}

class StreamMessageTabs extends PureComponent<
    StreamMessageTabsProps & HalResource,
    StreamMessageTabsState
> {
    state = {
        value: 0,
    };

    _handleChange: (e: FormEvent, value: number) => void = (e, value) =>
        this.setState({ value });

    render() {
        const {
            message: { payload, metadata },
            ...props
        } = this.props;
        const { value } = this.state;
        return (
            <Card>
                <CardActions>
                    <Tabs
                        value={value}
                        onChange={this._handleChange}
                        indicatorColor={'primary'}
                    >
                        <Tab
                            label={
                                <Typography variant={'body1'}>
                                    {'Data'}
                                </Typography>
                            }
                            icon={
                                <Typography>
                                    <Notes />
                                </Typography>
                            }
                        />
                        <Tab
                            label={
                                <Typography variant={'body1'}>
                                    {'Metadata'}
                                </Typography>
                            }
                            icon={
                                <Typography>
                                    <Settings />
                                </Typography>
                            }
                        />
                    </Tabs>
                </CardActions>
                <CardContent>
                    {value === 0 && <JsonViewer json={payload} {...props} />}
                    {value === 1 && <JsonViewer json={metadata} {...props} />}
                </CardContent>
            </Card>
        );
    }
}

const StreamMessage: ComponentType<StreamMessageState & HalViewerProps> = ({
    message,
    ...props
}) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <StreamHeader />
            <Table.Body>
                <StreamMessageDetails {...message} {...props} />
            </Table.Body>
        </Table>
        <StreamMessageTabs message={message} {...props} />
    </section>
);

export default connect<StreamMessageState, HalViewerProps>(state$)(
    StreamMessage,
);
