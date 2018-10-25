import React from 'react';
import { Observable as obs } from 'rxjs';
import inflector from 'inflector-js';
import { createState, connect } from '../../../reactive';
import store from '../../store';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../../components/StripeyTable';

const provider$ = store.body$.map(({ provider }) => () => provider);

const versions$ = store.body$.map(({ versions }) => () => versions);

const recent$ = store.body$
    .filter(({ _embedded }) => _embedded)
    .map(({ _embedded }) => () => _embedded.recent);

const state$ = createState(
    obs.merge(
        provider$.map(provider => ['provider', provider]),
        versions$.map(versions => ['versions', versions]),
        recent$.map(recent => ['recent', recent]),
    ),
    obs.of({ recent: { matches: [] }, provider: '', versions: {} }),
);

const Links = ({ provider, versions }) => (
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
                <TableRow>
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

Links.defaultProps = {
    links: [],
};

const Index = ({ provider, versions }) => (
    <section>
        <Links provider={provider} versions={versions} />
    </section>
);

export default connect(state$)(Index);
