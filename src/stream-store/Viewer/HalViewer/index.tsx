import React, { ComponentType, createElement, FunctionComponent } from 'react';
import { HyperMediaControls, NavigationLinks } from './../../../components';
import actions from './../../../stream-store/actions';
import rels from './../../../stream-store/rels';
import Home from './Home';
import Stream from './Stream';
import StreamBrowser from './StreamBrowser';
import StreamMessage from './StreamMessage';
import StreamMetadata from './StreamMetadata';
import { HalViewerProps } from './types';
import Unrecognized from './Unrecognized';

const formActions = {
    [rels.append]: actions.post,
    [rels.metadata]: actions.post,
    [rels.deleteStream]: actions.delete,
    [rels.deleteMessage]: actions.delete,
};

const views: { [rel: string]: ComponentType<HalViewerProps> } = {
    [rels.feed]: Stream,
    [rels.message]: StreamMessage,
    [rels.index]: Home,
    [rels.metadata]: StreamMetadata,
    [rels.browse]: StreamBrowser,
    _unrecognized: Unrecognized,
};

const HalViewer: FunctionComponent<HalViewerProps> = ({
    forms,
    _links,
    self,
}) => (
    <section>
        <NavigationLinks _links={_links} />
        <HyperMediaControls
            actions={formActions}
            forms={forms}
            _links={_links}
        />
        {createElement<HalViewerProps>(views[self] || views._unrecognized, {
            _links,
            forms,
            self,
        })}
    </section>
);

export default HalViewer;
