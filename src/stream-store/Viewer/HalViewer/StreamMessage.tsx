import {
    Card,
    CardActions,
    CardContent,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import React, { ComponentType, FormEvent, PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import { Notes, Settings } from '../../../components/Icons';
import { Table, TableBody } from '../../../components/StripeyTable';
import { connect, createState } from '../../../reactive';
import { HalResource } from '../../../types';
import store from '../../store';
import { JsonViewer, StreamHeader, StreamMessageDetails } from './components';
import { HalViewerProps } from './types';

const tryParseJson = (payload: string): object => {
    try {
        return JSON.parse(payload);
    } catch (e) {
        return {};
    }
};

const message$ = store.hal$.body$.map(({ payload, metadata, ...body }) => ({
    ...body,
    metadata: tryParseJson(metadata),
    payload: tryParseJson(payload),
}));

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
    message$.map(message => ['message', () => message]),
    obs.of<StreamMessageState>({
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
            <TableBody>
                <StreamMessageDetails {...message} {...props} />
            </TableBody>
        </Table>
        <StreamMessageTabs message={message} {...props} />
    </section>
);

export default connect<StreamMessageState, HalViewerProps>(state$)(
    StreamMessage,
);
