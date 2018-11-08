import { Hyperlink } from 'components';
import { TableCell, TableRow } from 'components/StripeyTable';
import React, { CSSProperties, StatelessComponent } from 'react';
import rels from 'stream-store/rels';
import { HalResource } from 'types';

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

interface StreamMessageDetailsProps {
    messageId: string;
    createdUtc: string;
    position: number;
    streamId: string;
    streamVersion: number;
    type: string;
}

const StreamMessageDetails: StatelessComponent<
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
    <TableRow>
        <TableCell style={nowrap}>
            <Hyperlink _links={_links} rel={rels.feed} />
        </TableCell>
        <TableCell style={nowrap}>{messageId}</TableCell>
        <TableCell style={nowrap}>{createdUtc}</TableCell>
        <TableCell style={nowrap}>{type}</TableCell>
        <TableCell style={{ width: '100%' }}>
            <Hyperlink _links={_links} rel={rels.self} />
        </TableCell>
        <TableCell numeric>{position}</TableCell>
    </TableRow>
);

export default StreamMessageDetails;
