import { Table } from 'components';
import inflector from 'inflector-js';
import React, { ComponentType, FunctionComponent } from 'react';
import { connect, createState } from 'reactive';
import { merge as observableMerge, of as observableOf, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalResource } from 'types';
import { clientVersion } from 'utils';
import { HalViewerProps } from './types';

const provider$ = store.hal$.body$.pipe(map(({ provider }) => provider));

const versions$ = store.hal$.body$.pipe(map(({ versions }) => versions));

const info$ = zip(provider$, versions$).pipe(
    map(([provider, versions]) =>
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
    ),
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

const recent$ = store.hal$.body$.pipe(
    map(({ _embedded = {} }) => _embedded[rels.feed] as HalResource[]),
);

const state$ = createState<IndexState>(
    observableMerge(
        info$.pipe(map(info => ['info', () => info])),
        recent$.pipe(map(recent => ['recent', () => recent])),
    ),
    observableOf<IndexState>({ recent: [], info: [] }),
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
