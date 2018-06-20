import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import { 
    Card,
    CardText,
    IconButton,
    Table, 
    TableBody, 
    TableRow, 
    TableRowColumn, 
    TableHeader, 
    TableHeaderColumn,
    Toolbar,
    ToolbarGroup,
    ToolbarTitle
    } from 'material-ui';
import { ActionCode } from 'material-ui/svg-icons';
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
        <TableHeaderColumn>StreamId</TableHeaderColumn>
        <TableHeaderColumn>Message Id</TableHeaderColumn>
        <TableHeaderColumn>Created UTC</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn style={{width: '100%'}}>Stream Id@Version</TableHeaderColumn>
        <TableHeaderColumn>Position</TableHeaderColumn>
    </TableRow>);

const StreamMessageDetails = ({ messageId, createdUtc, position, streamId, streamVersion, type, links }) => (
    <TableRow>
        <TableRowColumn>
            <a onClick={preventDefault(() => actions.get.next(links[rels.feed].href))} href="#">{streamId}</a>
        </TableRowColumn>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <a onClick={preventDefault(() => actions.get.next(links.self.href))} href="#">{streamId}@{streamVersion}</a>
        </TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
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
                <CardText><pre>{JSON.stringify(json, null, 4)}</pre></CardText>
            </Card>);
    }
    render() {
        const { json, title } = this.props;

        return (
            <div>
                <div onClick={this._handleClick}>
                    <Toolbar>
                        <ToolbarTitle 
                            text={title}
                        />
                    <ToolbarGroup>
                    <IconButton touch={true}>
                        <ActionCode />
                    </IconButton>
                    </ToolbarGroup>
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
        <Table selectable={false} fixedHeader={false} style={{ tableLayout: 'auto' }}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <StreamMessageHeader />
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows>
                <StreamMessageDetails {...message} links={links} />
            </TableBody>
        </Table>
        <StreamMessageData payload={message.payload} />
        <StreamMessageMetadata payload={message.metadata} />
    </section>);

export default connect(state$)(StreamMessage);