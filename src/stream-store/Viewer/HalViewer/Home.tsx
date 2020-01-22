import { Table } from './../../../components';
import inflector from 'inflector-js';
import React, { ComponentType, FunctionComponent } from 'react';
import { connect, createState } from './../../../reactive';
import { Observable as obs } from 'rxjs';
import rels from './../../../stream-store/rels';
import store from './../../../stream-store/store';
import { HalResource } from './../../../types';
import { clientVersion } from './../../../utils';
import { HalViewerProps } from './types';

const provider$ = store.hal$.body$.map(({ provider }) => provider);

const versions$ = store.hal$.body$.map(({ versions }) => versions);

const info$ = provider$.zip(versions$).map(([provider, versions]) =>
    [
        {
            id: 'Provider',
            value: inflector.camel2words(
                inflector.underscore(provider),
            ) as string,
        },
    ]
        .concat(
            Object.keys(versions).map(key => ({
                id: `${inflector.camel2words(
                    inflector.underscore(key),
                )} Version`,
                value: versions[key] as string,
            })),
        )
        .concat({
            id: 'Client Version',
            value: clientVersion as string,
        }),
);

interface RecentState {
    recent: HalResource[];
}

interface InfoLineProps {
    id: string;
    value: string;
}

interface InfoState {
    info: InfoLineProps[];
}

interface IndexState extends RecentState, InfoState {}

const recent$ = store.hal$.body$.map(
    ({ _embedded = {} }) => _embedded[rels.feed] as HalResource[],
);

const state$ = createState<IndexState>(
    obs.merge(
        info$.map(info => ['info', () => info]),
        recent$.map(recent => ['recent', () => recent]),
    ),
    obs.of<IndexState>({ recent: [], info: [] }),
);

const InfoLine: FunctionComponent<InfoLineProps> = ({ id, value }) => (
    <Table.Row>
        <Table.Cell>
            <strong>{id}</strong>
        </Table.Cell>
        <Table.Cell>{value}</Table.Cell>
    </Table.Row>
);

const Info: FunctionComponent<InfoState> = ({ info }) => (
    <Table>
        <Table.Head>
            <Table.Row>
                <Table.Cell colSpan={2}>{'Server Information'}</Table.Cell>
            </Table.Row>
        </Table.Head>
        <Table.Body>
            {info.map(({ id, value }) => (
                <InfoLine key={id} id={id} value={value} />
            ))}
        </Table.Body>
    </Table>
);

const Index: ComponentType<IndexState & HalViewerProps> = ({ info }) => (
    <section>
        <Info info={info} />
    </section>
);

export default connect<IndexState, HalViewerProps>(state$)(Index);
