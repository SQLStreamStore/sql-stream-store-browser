import { ComponentType } from 'react';
import { Observable as obs } from 'rxjs';
import StreamBrowser from '../../../components/StreamBrowser';
import { connect, createState } from '../../../reactive';
import { HalLink } from '../../../types';
import rels from '../../rels';
import store from '../../store';
import { HalViewerProps } from './types';

const streams$ = store.body$.map(({ _embedded = {} }) =>
    (_embedded[rels.feed] || [])
        .map(({ _links = {} }) => _links[rels.feed])
        .filter(link => link),
);

interface StreamBrowserState {
    loading: boolean;
    streams: HalLink[];
}

const state$ = createState<StreamBrowserState>(
    streams$.map(streams => ['streams', () => streams]),
    obs.of<StreamBrowserState>({ loading: false, streams: [] }),
);

export default connect(state$)(StreamBrowser) as ComponentType<HalViewerProps>;
