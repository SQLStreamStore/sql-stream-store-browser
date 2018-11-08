import { Hyperlink } from 'components';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from 'components/StripeyTable';
import React, { CSSProperties, StatelessComponent } from 'react';
import { connect, createState } from 'reactive';
import { Observable as obs } from 'rxjs';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalLinks, HalResource } from 'types';
import { JsonViewer } from './components';
import { HalViewerProps } from './types';

const metadata$ = store.hal$.body$.map(metadata => metadata);

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
            <Hyperlink _links={_links} rel={rels.feed} />
        </TableCell>
        <TableCell style={nowrap} numeric>
            {maxAge}
        </TableCell>
        <TableCell style={nowrap} numeric>
            {maxCount}
        </TableCell>
    </TableRow>
);

const StreamMetadata: StatelessComponent<
    StreamMetadataState & HalViewerProps
> = ({ metadata }) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <TableHead>
                <StreamMetadataHeader />
            </TableHead>
            <TableBody>
                <StreamMetadataDetails {...metadata} />
            </TableBody>
        </Table>
        <JsonViewer json={metadata.metadataJson} />
    </section>
);

export default connect<StreamMetadataState, HalViewerProps>(state$)(
    StreamMetadata,
);
