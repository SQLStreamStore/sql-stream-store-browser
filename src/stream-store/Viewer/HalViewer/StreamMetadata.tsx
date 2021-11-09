import { Hyperlink, Table } from 'components';
import React, { CSSProperties, FunctionComponent } from 'react';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalLinks, HalResource } from 'types';
import { JsonViewer } from './components';
import { HalViewerProps } from './types';

const metadata$ = store.hal$.body$.pipe(map(metadata => metadata));

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
    metadata$.pipe(map(metadata => ['metadata', () => metadata])),
    observableOf<StreamMetadataState>({
        metadata: {
            _embedded: {},
            _links: {},
            streamId: '',
        },
    }),
);

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

const StreamMetadataHeader = () => (
    <Table.Row>
        <Table.Cell>{'Stream'}</Table.Cell>
        <Table.Cell>{'Max Age'}</Table.Cell>
        <Table.Cell>{'Max Count'}</Table.Cell>
    </Table.Row>
);

interface StreamMetadataDetailsProps {
    streamId: string;
    maxAge?: number;
    maxCount?: number;
    _links: HalLinks;
}

const StreamMetadataDetails: FunctionComponent<StreamMetadataDetailsProps> = ({
    streamId,
    maxAge,
    maxCount,
    _links,
}) => (
    <Table.Row>
        <Table.Cell style={nowrap}>
            <Hyperlink _links={_links} rel={rels.feed} />
        </Table.Cell>
        <Table.Cell style={nowrap} numeric>
            {maxAge}
        </Table.Cell>
        <Table.Cell style={nowrap} numeric>
            {maxCount}
        </Table.Cell>
    </Table.Row>
);

const StreamMetadata: FunctionComponent<
    StreamMetadataState & HalViewerProps
> = ({ metadata }) => (
    <section>
        <Table style={{ tableLayout: 'auto' }}>
            <Table.Head>
                <StreamMetadataHeader />
            </Table.Head>
            <Table.Body>
                <StreamMetadataDetails {...metadata} />
            </Table.Body>
        </Table>
        <JsonViewer json={metadata.metadataJson} />
    </section>
);

export default connect<StreamMetadataState, HalViewerProps>(state$)(
    StreamMetadata,
);
