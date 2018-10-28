import { ComponentType } from 'react';
import { Observable as obs } from 'rxjs';
import StreamBrowser from '../../../components/StreamBrowser';
import { connect, createState } from '../../../reactive';
import { HalLink, HalResource } from '../../../types';
import rels from '../../rels';
import store from '../../store';
import { HalViewerProps } from './types';

const streams$ = store.hal$.body$.map(
    ({ _embedded = {} }) => _embedded[rels.feed] || [],
);

interface StreamBrowserState {
    loading: boolean;
    streams: HalResource[];
}

const state$ = createState<StreamBrowserState>(
    streams$.map(streams => ['streams', () => streams]),
    obs.of<StreamBrowserState>({ loading: false, streams: [] }),
);

export default connect(state$)(StreamBrowser) as ComponentType<HalViewerProps>;
