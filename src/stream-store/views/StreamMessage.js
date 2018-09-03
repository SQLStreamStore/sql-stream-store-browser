import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { Code } from '../../components/Icons';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/StripeyTable';
import { Hyperlink } from '../../components';
import { createState, connect } from '../../reactive';
import rels from '../rels';
import store from '../store';

const tryParseJson = payload => {
    try {
        return JSON.parse(payload);
    } catch (e) {
        return payload;
    }
};

const message$ = store.body$.map(({ payload, metadata, ...body }) => () => ({
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

class StreamMessageJson extends PureComponent {
    state = {
        expanded: true,
    };

    _handleClick = () => {
        const { expanded } = this.state;
        this.setState({
            expanded: !expanded,
        });
    };

    render() {
        const { json, title } = this.props;
        const { expanded } = this.state;
        return (
            <ExpansionPanel expanded={expanded} onClick={this._handleClick}>
                <ExpansionPanelSummary expandIcon={<Code />}>
                    <Typography variant={'title'}>{title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <pre>{JSON.stringify(json, null, 4)}</pre>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const StreamMessageData = ({ payload }) => (
    <StreamMessageJson title={'Data'} json={payload} />
);

const StreamMessageMetadata = ({ payload }) => (
    <StreamMessageJson title={'Metadata'} json={payload} />
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
    </section>
);

export default connect(state$)(StreamMessage);
