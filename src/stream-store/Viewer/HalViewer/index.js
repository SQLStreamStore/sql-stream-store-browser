import React, { createElement } from 'react';
import Home from './Home';
import Stream from './Stream';
import StreamBrowser from './StreamBrowser';
import StreamMessage from './StreamMessage';
import StreamMetadata from './StreamMetadata';
import Unrecognized from './Unrecognized';
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
    _unrecognized: Unrecognized,
};

const HalViewer = ({ self, links, forms }) => (
    <section>
        <NavigationLinks links={links} />
        <HyperMediaControls actions={formActions} forms={forms} links={links} />
        {createElement(views[self] || views._unrecognized, {
            links,
            forms,
            self,
        })}
    </section>
);

export default HalViewer;
