import { Hyperlink, Table } from './../../../../components';
import React, { CSSProperties, FunctionComponent } from 'react';
import rels from './../../../../stream-store/rels';
import { HalResource } from './../../../../types';

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

interface StreamMessageDetailsProps {
    messageId: string;
    createdUtc: string;
    position: number;
    streamId: string;
    streamVersion: number;
    type: string;
}

const StreamMessageDetails: FunctionComponent<
    StreamMessageDetailsProps & HalResource
> = ({
    messageId,
    createdUtc,
    position,
    streamId,
    streamVersion,
    type,
    _links,
}) => (
    <Table.Row>
        <Table.Cell style={nowrap}>
            <Hyperlink _links={_links} rel={rels.feed} />
        </Table.Cell>
        <Table.Cell style={nowrap}>{messageId}</Table.Cell>
        <Table.Cell style={nowrap}>{createdUtc}</Table.Cell>
        <Table.Cell style={nowrap}>{type}</Table.Cell>
        <Table.Cell style={{ width: '100%' }}>
            <Hyperlink _links={_links} rel={rels.self} />
        </Table.Cell>
        <Table.Cell numeric>{position}</Table.Cell>
    </Table.Row>
);

export default StreamMessageDetails;
