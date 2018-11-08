import { Table } from 'components';
import inflector from 'inflector-js';
import React, { ComponentType, StatelessComponent } from 'react';
import { connect, createState } from 'reactive';
import { Observable as obs } from 'rxjs';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalResource } from 'types';
import { HalViewerProps } from './types';

const provider$ = store.hal$.body$.map(({ provider }) => provider);

const versions$ = store.hal$.body$.map(({ versions }) => versions);

interface RecentState {
    recent: HalResource[];
}

interface InfoState {
    provider: string;
    versions: { [key: string]: string };
}

interface IndexState extends RecentState, InfoState {}

const recent$ = store.hal$.body$.map(
    ({ _embedded = {} }) => _embedded[rels.feed] as HalResource[],
);

const state$ = createState<IndexState>(
    obs.merge(
        provider$.map(provider => ['provider', () => provider]),
        versions$.map(versions => ['versions', () => versions]),
        recent$.map(recent => ['recent', () => recent]),
    ),
    obs.of<IndexState>({ recent: [], provider: '', versions: {} }),
);

const Info: StatelessComponent<InfoState> = ({ provider, versions }) => (
    <Table>
        <Table.Head>
            <Table.Row>
                <Table.Cell colSpan={2}>{'Server Information'}</Table.Cell>
            </Table.Row>
        </Table.Head>
        <Table.Body>
            <Table.Row>
                <Table.Cell>
                    <strong>{'Provider'}</strong>
                </Table.Cell>
                <Table.Cell>
                    {inflector.camel2words(inflector.underscore(provider))}
                </Table.Cell>
            </Table.Row>
            {Object.keys(versions).map(key => (
                <Table.Row key={key}>
                    <Table.Cell>
                        <strong>
                            {inflector.camel2words(inflector.underscore(key))}{' '}
                            {'Version'}
                        </strong>
                    </Table.Cell>
                    <Table.Cell>{versions[key]}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

const Index: ComponentType<IndexState & HalViewerProps> = ({
    provider,
    versions,
}) => (
    <section>
        <Info provider={provider} versions={versions} />
    </section>
);

export default connect<IndexState, HalViewerProps>(state$)(Index);
