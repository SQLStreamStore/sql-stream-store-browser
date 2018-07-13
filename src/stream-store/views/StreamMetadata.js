import React, { PureComponent } from 'react';
import { Observable as obs } from 'rxjs';
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { Code } from '@material-ui/icons';
import { createState, connect } from '../../reactive';
import { preventDefault } from '../../utils';
import rels from '../rels';
import store from '../store';
import { withAuthorization } from '../../components';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/StripeyTable';

const metadata$ = store.body$.map(metadata => () => metadata);

const state$ = createState(
    metadata$.map(metadata => ['metadata', metadata]),
    obs.of({ metadata: {} }),
);

const nowrap = { whiteSpace: 'nowrap' };

const StreamMetadataHeader = () => (
    <TableRow>
        <TableCell>{'Stream'}</TableCell>
        <TableCell>{'Max Age'}</TableCell>
        <TableCell>{'Max Count'}</TableCell>
    </TableRow>
);

const StreamMetadataDetails = withAuthorization(
    ({ authorization, streamId, maxAge, maxCount, links, onNavigate }) => (
        <TableRow>
            <TableCell style={nowrap}>
                <a
                    onClick={preventDefault(() =>
                        onNavigate(links[rels.feed].href, authorization),
                    )}
                    href={links[rels.feed].href}
                >
                    {streamId}
                </a>
            </TableCell>
            <TableCell style={nowrap} numeric>
                {maxAge}
            </TableCell>
            <TableCell style={nowrap} numeric>
                {maxCount}
            </TableCell>
        </TableRow>
    ),
);

class StreamMetadataJson extends PureComponent {
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
    };

    render() {
        const { metadataJson } = this.props;
        const { expanded } = this.state;
        return (
            <ExpansionPanel expanded={expanded} onClick={this._handleClick}>
                <ExpansionPanelSummary expandIcon={<Code />}>
                    <Typography variant={'title'}>{'Metadata'}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <pre>{JSON.stringify(metadataJson, null, 4)}</pre>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const StreamMetadata = ({ metadata, links, onNavigate }) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMetadataHeader />
            </TableHead>
            <TableBody>
                <StreamMetadataDetails
                    {...metadata}
                    links={links}
                    onNavigate={onNavigate}
                />
            </TableBody>
        </Table>
        <StreamMetadataJson metadata={metadata.metadataJson} />
    </section>
);

export default connect(state$)(StreamMetadata);
