import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import { 
    Card,
    CardContent,
    IconButton,
    Table, 
    TableCell,
    TableBody, 
    TableRow, 
    TableHead, 
    Toolbar,
    } from '@material-ui/core';
import { Code } from '@material-ui/icons';
import { createState, connect } from '../reactive';
import { actions, store, rels } from '../stream-store';
import { preventDefault } from '../utils';
import NavigationLinks from './NavigationLinks.jsx';

const tryParseJson = payload => {
    try {
        return JSON.parse(payload);
    }
    catch(e) {
        return payload;
    }
};

const links$ = store.links$
    .map(links => () => links);

const message$ = store.body$
    .map(({ payload, metadata, ...body }) => () => ({ 
        ...body,
        payload: tryParseJson(payload),
        metadata: tryParseJson(metadata)
    }));

const state$ = createState(
    obs.merge(
        links$.map(links => ['links', links]),
        message$.map(message => ['message', message])
    ),
    obs.of({ message: {}, links: {} }));

const StreamMessageHeader = () => (
    <TableRow>
        <TableCell>StreamId</TableCell>
        <TableCell>Message Id</TableCell>
        <TableCell>Created UTC</TableCell>
        <TableCell>Type</TableCell>
        <TableCell style={{width: '100%'}}>Stream Id@Version</TableCell>
        <TableCell>Position</TableCell>
    </TableRow>);

const nowrap = {whiteSpace: 'nowrap'};

const StreamMessageDetails = ({ messageId, createdUtc, position, streamId, streamVersion, type, links }) => (
    <TableRow>
        <TableCell style={nowrap}>
            <a onClick={preventDefault(() => actions.get.next(links[rels.feed].href))} href="#">{streamId}</a>
        </TableCell>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{width: '100%'}}>
            <a onClick={preventDefault(() => actions.get.next(links.self.href))} href="#">{streamId}@{streamVersion}</a>
        </TableCell>
        <TableCell numeric>{position}</TableCell>
    </TableRow>);

class StreamMessageJson extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            expanded: true
        };
    }
    _handleClick = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }
    _renderJson = (json) => {
        if (!this.state.expanded) {
            return null;
        }

        return (
            <Card>
                <CardContent><pre>{JSON.stringify(json, null, 4)}</pre></CardContent>
            </Card>);
    }
    render() {
        const { json, title } = this.props;

        return (
            <div>
                <div onClick={this._handleClick}>
                    <Toolbar>
                        {title}
                        <section>
                            <IconButton>
                                <Code />
                            </IconButton>
                        </section>
                    </Toolbar>
                </div>
                {this._renderJson(json)}
            </div>);
    }
}

const StreamMessageData = ({ payload }) => (
    <StreamMessageJson
        title={"Data"}
        json={payload}
    />
);

const StreamMessageMetadata = ({ payload }) => (
    <StreamMessageJson
        title={"Metadata"}
        json={payload}
    />
);

const StreamMessage = ({ message, links }) => (
    <section>
        <NavigationLinks 
            onNavigate={url => actions.get.next(url)}
            links={links} />
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMessageHeader />
            </TableHead>
            <TableBody>
                <StreamMessageDetails {...message} links={links} />
            </TableBody>
        </Table>
        <StreamMessageData payload={message.payload} />
        <StreamMessageMetadata payload={message.metadata} />
    </section>);

export default connect(state$)(StreamMessage);