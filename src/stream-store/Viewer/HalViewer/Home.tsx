import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from 'components/StripeyTable';
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
        <TableHead>
            <TableRow>
                <TableCell colSpan={2}>{'Server Information'}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>
                    <strong>{'Provider'}</strong>
                </TableCell>
                <TableCell>
                    {inflector.camel2words(inflector.underscore(provider))}
                </TableCell>
            </TableRow>
            {Object.keys(versions).map(key => (
                <TableRow key={key}>
                    <TableCell>
                        <strong>
                            {inflector.camel2words(inflector.underscore(key))}{' '}
                            {'Version'}
                        </strong>
                    </TableCell>
                    <TableCell>{versions[key]}</TableCell>
                </TableRow>
            ))}
        </TableBody>
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
