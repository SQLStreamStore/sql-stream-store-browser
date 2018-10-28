import React, { ComponentType, createElement, StatelessComponent } from 'react';
import { HyperMediaControls, NavigationLinks } from '../../../components';
import { actions } from '../../index';
import rels from '../../rels';
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

const HalViewer: StatelessComponent<HalViewerProps> = ({
    forms,
    links,
    self,
}) => (
    <section>
        <NavigationLinks links={links} />
        <HyperMediaControls actions={formActions} forms={forms} links={links} />
        {createElement<HalViewerProps>(views[self] || views._unrecognized, {
            forms,
            links,
            self,
        })}
    </section>
);

export default HalViewer;
