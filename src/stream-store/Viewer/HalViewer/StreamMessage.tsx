import {
    Card,
    CardActions,
    CardContent,
    Drawer,
    Tab,
    Tabs,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import React, {
    ComponentType,
    CSSProperties,
    FormEvent,
    PureComponent,
    ReactNode,
    StatelessComponent,
} from 'react';
import Inspector, {
    NodeRendererProps,
    ObjectLabel,
    ObjectName,
    ObjectRootLabel,
} from 'react-inspector';
import { Observable as obs } from 'rxjs';
import uriTemplate from 'uri-template';
import { Hyperlink, StreamBrowser } from '../../../components';
import { Notes, Settings } from '../../../components/Icons';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '../../../components/StripeyTable';
import { connect, createState } from '../../../reactive';
import { HalResource, NavigatableProps } from '../../../types';
import { hal, http } from '../../../utils';
import rels from '../../rels';
import store from '../../store';
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

const StreamMessageHeader = () => (
    <TableRow>
        <TableCell>{'StreamId'}</TableCell>
        <TableCell>{'Message Id'}</TableCell>
        <TableCell>{'Created UTC'}</TableCell>
        <TableCell>{'Type'}</TableCell>
        <TableCell style={{ width: '100%' }}>{'Stream Id@Version'}</TableCell>
        <TableCell>{'Position'}</TableCell>
    </TableRow>
);

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

interface StreamMessageDetailsProps {
    messageId: string;
    createdUtc: string;
    position: number;
    streamId: string;
    streamVersion: number;
    type: string;
}

const StreamMessageDetails: StatelessComponent<
    StreamMessageDetailsProps & HalResource
> = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    _links,
}) => (
    <TableRow>
        <TableCell style={nowrap}>
            <Hyperlink _links={_links} rel={rels.feed} />
        </TableCell>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{ width: '100%' }}>
            <Hyperlink _links={_links} rel={rels.self} />
        </TableCell>
        <TableCell numeric>{position}</TableCell>
    </TableRow>
);

const isPotentialStreamId = (data: any) =>
    typeof data === 'number' || typeof data === 'string';

const getStreamLinks = ({ _embedded }: HalResource): HalResource[] =>
    _embedded[rels.feed] || [];

interface StreamMessageJsonState {
    streams: HalResource[];
    loading: boolean;
    open: boolean;
}

const style = {
    drawerPaper: {
        width: 480,
    },
    streamId: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
};

interface StreamMessageJsonProps {
    json: object;
}

const StreamMessageJson = withStyles(style)(class extends PureComponent<
    StreamMessageJsonProps &
        NavigatableProps &
        HalResource &
        WithStyles<typeof style>,
    StreamMessageJsonState
> {
    state: StreamMessageJsonState = {
        loading: false,
        open: false,
        streams: [],
    };

    _handlePotentialStreamIdClick: (
        e: FormEvent,
        pattern: string,
    ) => Promise<void> = async ({ currentTarget: anchorElement }, pattern) => {
        const { authorization, _links } = this.props;

        this.setState({
            loading: true,
            open: true,
        });

        if (!_links || !_links[rels.browse]) {
            return;
        }

        const template = uriTemplate.parse(
            decodeURI(_links[rels.browse][0].href),
        );

        const responses = await Promise.all(
            [...new Set([pattern, String(pattern).replace('-', '')])].map(p =>
                http.get({
                    headers: { authorization },
                    link: {
                        href: template.expand({ p, t: 'e' }),
                    },
                }),
            ),
        );

        this.setState({
            loading: false,
            streams: Object.values(
                responses.flatMap(({ body }) =>
                    getStreamLinks(hal.normalizeResource(body as HalResource)),
                ),
            ),
        });
    };

    _handlePotentialStreamIdClose = () =>
        this.setState({
            open: false,
        });

    _renderNode = ({
        depth,
        name,
        data,
        isNonenumerable,
        ...props
    }: NodeRendererProps & { children?: ReactNode }) =>
        depth === 0 ? (
            <ObjectRootLabel name={name} data={{}} {...props} />
        ) : isPotentialStreamId(data) ? (
            <span>
                <ObjectName name={name} dimmed={isNonenumerable} />
                <span>: </span>
                <a
                    className={this.props.classes.streamId}
                    onClick={e => this._handlePotentialStreamIdClick(e, data)}
                >
                    {data}
                </a>
            </span>
        ) : (
            <ObjectLabel
                name={name}
                data={props.children ? {} : data}
                isNonenumerable={isNonenumerable}
                {...props}
            />
        );

    render() {
        const { json, classes } = this.props;
        const { streams, loading, open } = this.state;

        return (
            <div>
                <Inspector
                    data={json}
                    expandLevel={32}
                    nodeRenderer={this._renderNode}
                />
                <Drawer
                    variant={'temporary'}
                    open={open}
                    onClose={this._handlePotentialStreamIdClose}
                    anchor={'right'}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <StreamBrowser streams={streams} loading={loading} />
                </Drawer>
            </div>
        );
    }
} as ComponentType<StreamMessageJsonProps & HalResource>);

interface StreamMessageTabsState {
    value: number;
}

interface StreamMessageTabsProps {
    message: {
        payload: object;
        metadata?: object;
    };
}

// tslint:disable-next-line:max-classes-per-file
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
                        <Tab label={'Data'} />
                        <Tab label={'Metadata'} />
                    </Tabs>
                </CardActions>
                <CardContent>
                    {value === 0 && (
                        <StreamMessageJson json={payload} {...props} />
                    )}
                    {value === 1 && (
                        <StreamMessageJson json={metadata} {...props} />
                    )}
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
            <TableHead>
                <StreamMessageHeader />
            </TableHead>
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
