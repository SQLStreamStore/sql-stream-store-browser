import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { Code } from '@material-ui/icons';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/StripeyTable';
import { createState, connect } from '../../reactive';
import rels from '../rels';
import store from '../store';
import { preventDefault } from '../../utils';

const tryParseJson = (payload) => {
    try {
        return JSON.parse(payload);
    } catch (e) {
        return payload;
    }
};

const message$ = store.body$
    .map(({ payload, metadata, ...body }) => () => ({
        ...body,
        payload: tryParseJson(payload),
        metadata: tryParseJson(metadata),
    }));

const state$ = createState(
    message$.map(message => ['message', message]),
    obs.of({ message: {} }),
);

const StreamMessageHeader = () => (
    <TableRow>
        <TableCell>
            {'StreamId'}
        </TableCell>
        <TableCell>
            {'Message Id'}
        </TableCell>
        <TableCell>
            {'Created UTC'}
        </TableCell>
        <TableCell>
            {'Type'}
        </TableCell>
        <TableCell style={{ width: '100%' }}>
            {'Stream Id@Version'}
        </TableCell>
        <TableCell>
            {'Position'}
        </TableCell>
    </TableRow>);

const nowrap = { whiteSpace: 'nowrap' };

const getFeed = links => (links[rels.feed] || {}).href;

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
            <a
                onClick={preventDefault(() => onNavigate(links[rels.feed].href))}
                href={getFeed(links)}
            >
                {streamId}
            </a>
        </TableCell>
        <TableCell style={nowrap}>
            {messageId}
        </TableCell>
        <TableCell style={nowrap}>
            {createdUtc}
        </TableCell>
        <TableCell style={nowrap}>
            {type}
        </TableCell>
        <TableCell style={{ width: '100%' }}>
            <a
                onClick={preventDefault(() => onNavigate(links.self.href))}
                href={getFeed(links)}
            >
                {streamId}
@
                {streamVersion}
            </a>
        </TableCell>
        <TableCell numeric>
            {position}
        </TableCell>
    </TableRow>);

class StreamMessageJson extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
        };
    }

    _handleClick = () => {
        const { expanded } = this.state;
        this.setState({
            expanded: !expanded,
        });
    }

    render() {
        const { json, title } = this.props;
        const { expanded } = this.state;
        return (
            <ExpansionPanel
                expanded={expanded}
                onClick={this._handleClick}
            >
                <ExpansionPanelSummary
                    expandIcon={<Code />}
                >
                    <Typography variant="title">
                        {title}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <pre>
                        {JSON.stringify(json, null, 4)}
                    </pre>
                </ExpansionPanelDetails>
            </ExpansionPanel>);
    }
}

const StreamMessageData = ({ payload }) => (
    <StreamMessageJson
        title="Data"
        json={payload}
    />
);

const StreamMessageMetadata = ({ payload }) => (
    <StreamMessageJson
        title="Metadata"
        json={payload}
    />
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
        <StreamMessageData payload={message.payload} />
        <StreamMessageMetadata payload={message.metadata} />
    </section>);

export default connect(state$)(StreamMessage);
