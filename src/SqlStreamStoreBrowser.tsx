import { AppBar, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { ComponentType } from 'react';
import { Observable as obs } from 'rxjs';
import {
    AuthorizationProvider,
    Loading,
    mount,
    NavigationProvider,
    Notifications,
    withAuthorization,
} from './components';
import { SqlStreamStore } from './components/Icons';
import { connect, createState } from './reactive';
import { actions, store, Viewer } from './stream-store';
import theme from './theme';
import { HalLink, HalLinks } from './types';
import { mediaTypes } from './utils';

const getSelfAlias = links =>
    Object.keys(links)
        .flatMap(rel => links[rel])
        .filter(({ rel }) => rel.indexOf('streamStore:') === 0)
        .filter(
            ({ rel, href }) =>
                !!links.self.filter(link => link.href === href).length,
        )
        .map(({ rel }) => rel);

const self$ = store.hal$.links$
    .filter(links => !!links.self)
    .map(getSelfAlias)
    .filter(rel => !!rel)
    .map(([link]) => link);

interface SqlStreamStoreBrowserState {
    loading: boolean;
    mediaType: string;
    links: HalLinks;
    self: HalLink;
}
const state$ = createState<SqlStreamStoreBrowserState>(
    obs.merge(
        self$.map(self => ['self', () => self]),
        store.hal$.links$.map(links => ['links', () => links]),
        store.hal$.forms$.map(forms => ['forms', () => forms]),
        store.hal$.loading$.map(loading => ['loading', () => loading]),
        store.hal$.mediaType$.map(mediaType => ['mediaType', () => mediaType]),
    ),
    obs.of({
        forms: {},
        links: {},
        loading: false,
        mediaType: mediaTypes.hal,
        self: {
            href: '',
        },
    }),
);

const onNavigate = (link: HalLink, authorization: string | undefined) =>
    link.href.indexOf('#') === -1 &&
    actions.get.request.next({ link, headers: { authorization } });

const initialNavigation = ({ authorization }) =>
    onNavigate(
        { href: window.location.href, type: mediaTypes.any },
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

const SqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState
> = withAuthorization()(
    mount<SqlStreamStoreBrowserState & { authorization: string | undefined }>(
        initialNavigation,
    )(({ loading, ...props }) => (
        <MuiThemeProvider theme={theme}>
            <div>
                <CssBaseline />
                <Hero />
                <Loading open={loading} />
                <NavigationProvider onNavigate={onNavigate}>
                    <Viewer {...props} />
                    <Notifications />
                </NavigationProvider>
            </div>
        </MuiThemeProvider>
    )),
);

const AuthorizedSqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState & { authorization: string | undefined }
> = ({ authorization, ...props }) => (
    <AuthorizationProvider authorization={authorization}>
        <SqlStreamStoreBrowser {...props} />
    </AuthorizationProvider>
);

export default connect(state$)(AuthorizedSqlStreamStoreBrowser);
