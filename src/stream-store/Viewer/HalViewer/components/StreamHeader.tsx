import { Table } from 'components';
import React from 'react';

const StreamHeader = () => (
    <Table.Head>
        <Table.Row>
            <Table.Cell>{'StreamId'}</Table.Cell>
            <Table.Cell>{'Message Id'}</Table.Cell>
            <Table.Cell>{'Created UTC'}</Table.Cell>
            <Table.Cell>{'Type'}</Table.Cell>
            <Table.Cell style={{ width: '100%' }}>
                {'Stream Id@Version'}
            </Table.Cell>
            <Table.Cell>{'Position'}</Table.Cell>
        </Table.Row>
    </Table.Head>
);

export default StreamHeader;
