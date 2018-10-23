import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import {
    Card,
    CardActions,
    CardContent,
    Drawer,
    Tab,
    Tabs,
    withStyles,
} from '@material-ui/core';
import Inspector, {
    ObjectLabel,
    ObjectRootLabel,
    ObjectName,
} from 'react-inspector';
import uriTemplate from 'uri-template';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../../components/StripeyTable';
import { Hyperlink, StreamBrowser } from '../../../components';
import { Notes, Settings } from '../../../components/Icons';
import { createState, connect } from '../../../reactive';
import rels from '../../rels';
import { http } from '../../../utils';
import store from '../../store';

const tryParseJson = payload => {
    try {
        return JSON.parse(payload);
    } catch (e) {
        return payload;
    }
};

const message$ = store.body$.map(({ payload, metadata, ...body }) => ({
    ...body,
    payload: tryParseJson(payload),
    metadata: tryParseJson(metadata),
}));

const state$ = createState(
    message$.map(message => ['message', () => message]),
    obs.of({ message: {} }),
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

const nowrap = { whiteSpace: 'nowrap' };

const StreamMessageDetails = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    links,
}) => (
    <TableRow>
        <TableCell style={nowrap}>
            <Hyperlink link={links[rels.feed][0]}>{streamId}</Hyperlink>
        </TableCell>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{ width: '100%' }}>
            <Hyperlink link={links[rels.self][0]}>
                {streamId}
                {'@'}
                {streamVersion}
            </Hyperlink>
        </TableCell>
        <TableCell numeric>{position}</TableCell>
    </TableRow>
);

const isPotentialStreamId = data =>
    typeof data === 'number' || typeof data === 'string';

const getStreamIds = ({ _embedded = {} }) =>
    (_embedded[rels.feed] || [])
        .map(({ _links = {} }) => _links[rels.feed])
        .filter(link => link);

const StreamMessageJson = withStyles({
    streamId: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    drawerPaper: {
        width: 480,
    },
})(
    class StreamMessageJson extends PureComponent {
        state = {
            streams: [],
            loading: false,
            open: false,
        };

        _handlePotentialStreamIdClick = async (
            { currentTarget: anchorElement },
            pattern,
        ) => {
            const { authorization, links } = this.props;

            this.setState({
                loading: true,
                open: true,
            });

            if (!links[rels.browse]) {
                return;
            }

            const template = uriTemplate.parse(
                decodeURI(links[rels.browse].href),
            );

            const responses = await Promise.all(
                [...new Set([pattern, String(pattern).replace('-', '')])].map(
                    p =>
                        http.get({
                            url: template.expand({ p, t: 'e' }),
                            headers: { authorization },
                        }),
                ),
            );

            this.setState({
                streams: Object.values(
                    responses.flatMap(({ body }) => getStreamIds(body)).reduce(
                        (akk, { href, title }) => ({
                            ...akk,
                            [href]: { href, title },
                        }),
                        {},
                    ),
                ),
                loading: false,
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
            path,
            isNonEnumerable,
            ...props
        }) =>
            depth === 0 ? (
                <ObjectRootLabel
                    name={name}
                    data={{}}
                    path={path}
                    isNonEnumerable={isNonEnumerable}
                    {...props}
                />
            ) : isPotentialStreamId(data) ? (
                <span>
                    <ObjectName name={name} dimmed={isNonEnumerable} />
                    <span>: </span>
                    <a
                        className={this.props.classes.streamId}
                        onClick={e =>
                            this._handlePotentialStreamIdClick(e, data)
                        }
                    >
                        {data}
                    </a>
                </span>
            ) : (
                <ObjectLabel
                    name={name}
                    data={props.children ? {} : data}
                    path={path}
                    isNonEnumerable={isNonEnumerable}
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
    },
);

class StreamMessageTabs extends PureComponent {
    state = {
        value: 0,
    };

    _handleChange = (e, value) => this.setState({ value });

    render() {
        const {
            message: { payload, metadata },
            links,
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
                        <Tab label={'Data'} icon={<Notes />} />
                        <Tab label={'Metadata'} icon={<Settings />} />
                    </Tabs>
                </CardActions>
                <CardContent>
                    {value === 0 && (
                        <StreamMessageJson json={payload} links={links} />
                    )}
                    {value === 1 && (
                        <StreamMessageJson json={metadata} links={links} />
                    )}
                </CardContent>
            </Card>
        );
    }
}

const StreamMessage = ({ message, links }) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMessageHeader />
            </TableHead>
            <TableBody>
                <StreamMessageDetails {...message} links={links} />
            </TableBody>
        </Table>
        <StreamMessageTabs message={message} links={links} />
    </section>
);

export default connect(state$)(StreamMessage);
