import { TableCell, TableHead, TableRow } from 'components/StripeyTable';
import React from 'react';

const StreamHeader = () => (
    <TableHead>
        <TableRow>
            <TableCell>{'StreamId'}</TableCell>
            <TableCell>{'Message Id'}</TableCell>
            <TableCell>{'Created UTC'}</TableCell>
            <TableCell>{'Type'}</TableCell>
            <TableCell style={{ width: '100%' }}>
                {'Stream Id@Version'}
            </TableCell>
            <TableCell>{'Position'}</TableCell>
        </TableRow>
    </TableHead>
);

export default StreamHeader;
