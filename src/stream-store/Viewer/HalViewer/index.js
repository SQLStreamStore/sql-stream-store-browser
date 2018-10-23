import React, { createElement } from 'react';
import Home from './Home';
import Stream from './Stream';
import StreamBrowser from './StreamBrowser';
import StreamMessage from './StreamMessage';
import StreamMetadata from './StreamMetadata';
import Unknown from './Unknown';
import rels from '../../rels';
import { HyperMediaControls, NavigationLinks } from '../../../components';
import { actions } from '../../index';

const formActions = {
    [rels.append]: actions.post,
    [rels.metadata]: actions.post,
    [rels.deleteStream]: actions.delete,
    [rels.deleteMessage]: actions.delete,
};

const views = {
    [rels.feed]: Stream,
    [rels.message]: StreamMessage,
    [rels.index]: Home,
    [rels.metadata]: StreamMetadata,
    [rels.browse]: StreamBrowser,
    _unknown: Unknown,
};

const HalViewer = ({ self, links, forms, onNavigate }) => (
    <section>
        <NavigationLinks onNavigate={onNavigate} links={links} />
        <HyperMediaControls
            actions={formActions}
            forms={forms}
            links={links}
            onNavigate={onNavigate}
        />
        {createElement(views[self] || views._unknown, {
            links,
            forms,
            self,
            onNavigate,
        })}
    </section>
);

export default HalViewer;
