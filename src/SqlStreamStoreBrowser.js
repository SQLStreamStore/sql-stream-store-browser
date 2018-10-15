import React, { createElement } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Observable as obs } from 'rxjs';
import {
    mount,
    withAuthorization,
    AuthorizationProvider,
    Notifications,
    HyperMediaControls,
    NavigationLinks,
    Loading,
} from './components';
import { SqlStreamStore } from './components/Icons';
import { actions, store, rels, views } from './stream-store';
import theme from './theme';
import { createState, connect } from './reactive';

const getSelfAlias = links =>
    Object.keys(links)
        .filter(rel => rel.indexOf('streamStore:') === 0)
        .filter(rel => links[rel].href === links.self.href)[0];

const self$ = store.links$
    .filter(links => links.self)
    .map(getSelfAlias)
    .filter(rel => !!rel);

const state$ = createState(
    obs.merge(
        self$.map(self => ['self', () => self]),
        store.links$.map(links => ['links', () => links]),
        store.forms$.map(forms => ['forms', () => forms]),
        store.loading$.map(loading => ['loading', () => loading]),
    ),
    obs.of({ links: {}, forms: {}, loading: false }),
);

const onNavigate = (url, authorization) =>
    actions.get.request.next({ url, headers: { authorization } });

const initialNavigation = ({ authorization }) =>
    onNavigate(window.location.href, authorization);

const formActions = {
    [rels.append]: actions.post,
    [rels.metadata]: actions.post,
    [rels.delete]: actions.delete,
};

const Hero = () => (
    <AppBar position={'static'}>
        <Toolbar>
            <SqlStreamStore color={'action'} />
            <Typography variant={'h6'} color={'inherit'}>
                Sql Stream Store
            </Typography>
        </Toolbar>
    </AppBar>
);

const SqlStreamStoreBrowser = withAuthorization()(
    mount(initialNavigation)(({ self, links, forms, loading }) => (
        <MuiThemeProvider theme={theme}>
            <div>
                <CssBaseline />
                <Hero />
                <Loading open={loading} />
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
                <Notifications />
            </div>
        </MuiThemeProvider>
    )),
);

const AuthorizedSqlStreamStoreBrowser = ({ authorization, ...props }) => (
    <AuthorizationProvider authorization={authorization}>
        <SqlStreamStoreBrowser {...props} />
    </AuthorizationProvider>
);

export default connect(state$)(AuthorizedSqlStreamStoreBrowser);
