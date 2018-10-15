import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import {
    Popover,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    withStyles,
} from '@material-ui/core';
import Inspector, {
    ObjectLabel,
    ObjectRootLabel,
    ObjectName,
} from 'react-inspector';
import uriTemplate from 'uri-template';
import { Code } from '../../components/Icons';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/StripeyTable';
import { Hyperlink, StreamBrowser } from '../../components';
import { createState, connect } from '../../reactive';
import rels from '../rels';
import { http } from '../../utils';
import store from '../store';

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

const getHref = (links, rel) => (links[rel] || {}).href;

const nowrap = { whiteSpace: 'nowrap' };

const StreamMessageDetails = ({
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
        <TableCell style={nowrap}>
            <Hyperlink href={getHref(links, rels.feed)} onNavigate={onNavigate}>
                {streamId}
            </Hyperlink>
        </TableCell>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{ width: '100%' }}>
            <Hyperlink href={getHref(links, rels.self)} onNavigate={onNavigate}>
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
})(
    class StreamMessageJson extends PureComponent {
        state = {
            anchorElement: undefined,
            streams: [],
        };

        _handlePotentialStreamIdClick = async (
            { currentTarget: anchorElement },
            pattern,
        ) => {
            const { authorization, links } = this.props;

            this.setState({
                anchorElement,
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
            });
        };

        _handlePotentialStreamIdClose = () =>
            this.setState({
                anchorElement: undefined,
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
                    <span
                        className={this.props.classes.streamId}
                        onClick={e =>
                            this._handlePotentialStreamIdClick(e, data)
                        }
                    >
                        {data}
                    </span>
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
            const { json, onNavigate } = this.props;
            const { anchorElement, streams } = this.state;
            return (
                <div>
                    <Inspector
                        data={json}
                        expandLevel={32}
                        nodeRenderer={this._renderNode}
                    />
                    <Popover
                        open={!!anchorElement}
                        anchorEl={anchorElement}
                        onClose={this._handlePotentialStreamIdClose}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <StreamBrowser
                            streams={streams}
                            onNavigate={onNavigate}
                        />
                    </Popover>
                </div>
            );
        }
    },
);

const StreamMessageData = ({ payload, ...props }) => (
    <StreamMessageJson title={'Data'} json={payload} {...props} />
);

const StreamMessageMetadata = ({ payload, ...props }) => (
    <StreamMessageJson title={'Metadata'} json={payload} {...props} />
);

const StreamMessage = ({ message, links, onNavigate }) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMessageHeader />
            </TableHead>
            <TableBody>
                <StreamMessageDetails
                    {...message}
                    links={links}
                    onNavigate={onNavigate}
                />
            </TableBody>
        </Table>
        <StreamMessageData
            payload={message.payload}
            onNavigate={onNavigate}
            links={links}
        />
        <StreamMessageMetadata
            payload={message.metadata}
            onNavigate={onNavigate}
            links={links}
        />
    </section>
);

export default connect(state$)(StreamMessage);
