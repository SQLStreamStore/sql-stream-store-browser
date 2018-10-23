import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Observable as obs } from 'rxjs';
import {
    mount,
    withAuthorization,
    AuthorizationProvider,
    Notifications,
    Loading,
} from './components';
import { SqlStreamStore } from './components/Icons';
import { actions, store, Viewer } from './stream-store';
import theme from './theme';
import { createState, connect } from './reactive';
import { mediaTypes } from './utils';

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
        store.mediaType$.map(mediaType => ['mediaType', () => mediaType]),
    ),
    obs.of({ links: {}, forms: {}, loading: false }),
);

const onNavigate = (link, authorization) =>
    link.href.indexOf('#') === -1 &&
    actions.get.request.next({ link, headers: { authorization } });

const initialNavigation = ({ authorization }) =>
    onNavigate(
        { href: window.location.href, type: mediaTypes.hal },
        authorization,
    );

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
    mount(initialNavigation)(({ loading, ...props }) => (
        <MuiThemeProvider theme={theme}>
            <div>
                <CssBaseline />
                <Hero />
                <Loading open={loading} />
                <Viewer {...props} onNavigate={onNavigate} />
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
