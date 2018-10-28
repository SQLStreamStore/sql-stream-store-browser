import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography,
} from '@material-ui/core';
import React, {
    ComponentType,
    CSSProperties,
    PureComponent,
    StatelessComponent,
} from 'react';
import { Observable as obs } from 'rxjs';
import { Hyperlink } from '../../../components';
import { Code } from '../../../components/Icons';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '../../../components/StripeyTable';
import { connect, createState } from '../../../reactive';
import { HalLinks, HalResource } from '../../../types';
import rels from '../../rels';
import store from '../../store';
import { HalViewerProps } from './types';

const metadata$ = store.body$.map(metadata => metadata);

interface MetadataState {
    streamId: string;
    maxAge?: number;
    maxCount?: number;
    metadataJson?: object;
}

interface StreamMetadataState {
    metadata: MetadataState & HalResource;
}

const state$ = createState<StreamMetadataState>(
    metadata$.map(metadata => ['metadata', () => metadata]),
    obs.of<StreamMetadataState>({
        metadata: {
            _embedded: {},
            _links: {},
            streamId: '',
        },
    }),
);

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

const StreamMetadataHeader = () => (
    <TableRow>
        <TableCell>{'Stream'}</TableCell>
        <TableCell>{'Max Age'}</TableCell>
        <TableCell>{'Max Count'}</TableCell>
    </TableRow>
);

interface StreamMetadataDetailsProps {
    streamId: string;
    maxAge?: number;
    maxCount?: number;
    _links: HalLinks;
}

const StreamMetadataDetails: StatelessComponent<StreamMetadataDetailsProps> = ({
    streamId,
    maxAge,
    maxCount,
    _links,
}) => (
    <TableRow>
        <TableCell style={nowrap}>
            <Hyperlink link={_links[rels.feed][0]}>{streamId}</Hyperlink>
        </TableCell>
        <TableCell style={nowrap} numeric>
            {maxAge}
        </TableCell>
        <TableCell style={nowrap} numeric>
            {maxCount}
        </TableCell>
    </TableRow>
);

interface StreamMetadataJsonProps {
    metadataJson: any;
}

interface StreamMetadataJsonState {
    expanded: boolean;
}
class StreamMetadataJson extends PureComponent<
    StreamMetadataJsonProps,
    StreamMetadataJsonState
> {
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
        const { metadataJson } = this.props;
        const { expanded } = this.state;
        return (
            <ExpansionPanel expanded={expanded} onClick={this._handleClick}>
                <ExpansionPanelSummary expandIcon={<Code />}>
                    <Typography variant={'h6'}>{'Metadata'}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <pre>{JSON.stringify(metadataJson, null, 4)}</pre>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const StreamMetadata: StatelessComponent<StreamMetadataState> = ({
    metadata
}) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMetadataHeader />
            </TableHead>
            <TableBody>
                <StreamMetadataDetails {...metadata} />
            </TableBody>
        </Table>
        <StreamMetadataJson metadataJson={metadata.metadataJson} />
    </section>
);

export default connect(state$)(StreamMetadata) as ComponentType<HalViewerProps>;
