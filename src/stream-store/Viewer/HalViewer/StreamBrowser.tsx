import { StreamBrowser } from 'components';
import React, { ComponentType } from 'react';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import rels from 'stream-store/rels';
import store from 'stream-store/store';
import { HalResource } from 'types';
import { HalViewerProps } from './types';

const streams$ = store.hal$.body$.pipe(
    map(({ _embedded = {} }) => _embedded[rels.feed] || []),
);

interface StreamBrowserState {
    loading: boolean;
    streams: HalResource[];
}

const state$ = createState<StreamBrowserState>(
    streams$.pipe(map(streams => ['streams', () => streams])),
    observableOf<StreamBrowserState>({ loading: false, streams: [] }),
);

const StreamBrowserComponent: ComponentType<
    StreamBrowserState & HalViewerProps
> = ({ streams, loading }) => (
    <StreamBrowser loading={loading} streams={streams} />
);

export default connect<StreamBrowserState, HalViewerProps>(state$)(
    StreamBrowserComponent,
);
