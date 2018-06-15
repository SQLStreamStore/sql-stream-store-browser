import React from 'react';
import { MuiThemeProvider, getMuiTheme }  from 'material-ui/styles';
import { Observable as obs } from 'rxjs';

import ApplicationBar, { actions as applicationBarActions } from './ApplicationBar.jsx';
import { Stream, StreamMessage, Index } from './components';
import { actions, store, rels } from './stream-store';
import theme from './theme';
import { createState, connect } from './reactive';

const viewsByRel = {
    [rels.feed]: props => <Stream {...props} />,
    [rels.message]: props => <StreamMessage {...props} />,
    [rels.index]: props => <Index {...props} />
};

const getSelfAlias = links => Object
    .keys(links)
    .filter(rel => rel.indexOf("streamStore:") === 0)
    .filter(rel => links[rel].href === links.self.href)[0];

const self$ = store.links$
    .filter(links => links.self)
    .map(getSelfAlias)
    .filter(rel => !!rel);

const server$ = applicationBarActions.connect;

server$.subscribe(server => actions.get.next(server));

const state$ = createState(obs.merge(
    self$.map(self => ['self', () => self]),
    server$.map(server => ['server', () => server])
));

const muiTheme = getMuiTheme(theme);

const SqlStreamStoreBrowser = ({ self, server }) => (
    <MuiThemeProvider muiTheme={muiTheme} >
        <div>
            <ApplicationBar />
            {viewsByRel[self] && viewsByRel[self]({ server })}
        </div>
    </MuiThemeProvider>);

export default connect(state$)(SqlStreamStoreBrowser);