import React, { createElement } from 'react';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider }  from '@material-ui/core/styles';
import { Observable as obs } from 'rxjs';

import { 
    Stream,
    StreamMessage,
    StreamMetadata,
    Index,
    mount,
    Notifications,
    FormButtons,
    NavigationLinks
} from './components';
import { actions, store, rels } from './stream-store';
import theme from './theme';
import { createState, connect } from './reactive';

const empty = () => null;

const viewsByRel = {
    [rels.feed]: Stream,
    [rels.message]: StreamMessage,
    [rels.index]: Index,
    [rels.metadata]: StreamMetadata
};

const getSelfAlias = links => Object
    .keys(links)
    .filter(rel => rel.indexOf("streamStore:") === 0)
    .filter(rel => links[rel].href === links.self.href)[0];

const self$ = store.links$
    .filter(links => links.self)
    .map(getSelfAlias)
    .filter(rel => !!rel);

const state$ = createState(
    obs.merge(
        self$.map(self => ['self', () => self]),
        store.links$.map(links => ['links', () => links]),
        store.forms$.map(forms => ['forms', () => forms])
    ), obs.of({ links: {}, forms: {} }));

const initialNavigation = () => actions.get.next(window.location.href);

const onNavigate = url => actions.get.next(url);

const SqlStreamStoreBrowser = ({ self, links, forms }) => (
    <MuiThemeProvider theme={theme} >
        <div>
            <CssBaseline />
            <section>
                <NavigationLinks
                    onNavigate={onNavigate}
                    links={links}
                />
                <FormButtons
                    forms={forms}
                />
                {createElement(viewsByRel[self] || empty, { links, forms, self })}
            </section>
            <Notifications />
        </div>
    </MuiThemeProvider>);

export default mount(initialNavigation)(connect(state$)(SqlStreamStoreBrowser));
