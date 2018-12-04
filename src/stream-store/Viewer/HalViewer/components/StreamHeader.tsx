import { Table } from 'components';
import React, { CSSProperties } from 'react';

const nowrap: CSSProperties = { whiteSpace: 'nowrap' };

const StreamHeader = () => (
    <Table.Head>
        <Table.Row>
            <Table.Cell style={nowrap}>{'Stream Id'}</Table.Cell>
            <Table.Cell style={nowrap}>{'Message Id'}</Table.Cell>
            <Table.Cell style={nowrap}>{'Created UTC'}</Table.Cell>
            <Table.Cell style={nowrap}>{'Type'}</Table.Cell>
            <Table.Cell style={{ width: '100%' }}>
                {'Stream Id@Version'}
            </Table.Cell>
            <Table.Cell style={nowrap}>{'Position'}</Table.Cell>
        </Table.Row>
    </Table.Head>
);

export default StreamHeader;
