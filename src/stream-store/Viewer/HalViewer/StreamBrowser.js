import React from 'react';
import { Observable as obs } from 'rxjs';
import StreamBrowser from '../../../components/StreamBrowser';
import { createState, connect } from '../../../reactive';
import rels from '../../rels';
import store from '../../store';

const streams$ = store.body$.map(({ _embedded = {} }) => () =>
    (_embedded[rels.feed] || [])
        .map(({ _links = {} }) => _links[rels.feed])
        .filter(link => link),
);

const state$ = createState(
    streams$.map(streams => ['streams', streams]),
    obs.of({ streams: [] }),
);

export default connect(state$)(StreamBrowser);
