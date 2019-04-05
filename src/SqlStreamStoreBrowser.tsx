import {
    AppBar,
    CssBaseline,
    IconButton,
    Theme,
    Toolbar,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import {
    AuthorizationProvider,
    Loading,
    mount,
    NavigationProvider,
    Notifications,
    withAuthorization,
} from 'components';
import { LightbulbFull, LightbulbOutline, SqlStreamStore } from 'icons';
import { JSONSchema7 } from 'json-schema';
import React, { ComponentType, createElement } from 'react';
import { connect, createState } from 'reactive';
import { merge as observableMerge, of as observableOf } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { actions, store, Viewer } from 'stream-store';
import themes from 'themes';
import { AuthorizationProps, HalLink, HalLinks } from 'types';
import { mediaTypes, preventDefault } from 'utils';

const getSelfAlias = (links: HalLinks) =>
    Object.keys(links)
        .flatMap(rel => links[rel])
        .filter(({ rel }) => rel && rel.indexOf('streamStore:') === 0)
        .filter(
            ({ href }) =>
                !!links.self.filter(link => link.href === href).length,
        )
        .map(({ rel }) => rel);

const self$ = store.hal$.links$.pipe(
    filter(links => !!links.self),
    map(getSelfAlias),
    filter(rel => !!rel),
    map(([link]) => link),
);

interface SqlStreamStoreBrowserState {
    loading: boolean;
    mediaType: string;
    _links: HalLinks;
    self: HalLink;
    theme: Theme;
    forms: { [rel: string]: JSONSchema7 };
}
const state$ = createState<SqlStreamStoreBrowserState>(
    observableMerge(
        self$.pipe(map(self => ['self', () => self])),
        store.hal$.links$.pipe(map(links => ['_links', () => links])),
        store.hal$.forms$.pipe(map(forms => ['forms', () => forms])),
        store.hal$.loading$.pipe(map(loading => ['loading', () => loading])),
        store.mediaType$.pipe(map(mediaType => ['mediaType', () => mediaType])),
        themes.theme$.pipe(map(theme => ['theme', () => theme])),
    ),
    observableOf({
        _links: {},
        forms: {},
        loading: false,
        mediaType: mediaTypes.hal,
        self: {
            href: '',
        },
        theme: themes.defaultTheme,
    }),
);

const onNavigate = (link: HalLink, authorization: string | undefined) =>
    link.href.indexOf('#') === -1 &&
    actions.get.request.next({ link, headers: { authorization } });

const initialNavigation = ({ authorization }: AuthorizationProps) =>
    onNavigate(
        { href: window.location.href, type: mediaTypes.any },
        authorization,
    );

const lightbulbs: { [key: string]: ComponentType<SvgIconProps> } = {
    dark: LightbulbFull,
    light: LightbulbOutline,
};

const heroStyle = {
    themeToggle: {
        marginLeft: 'auto',
    },
};
interface HeroProps {
    theme: Theme;
}

const onThemeToggle = preventDefault(() => themes.actions.type.next(void 0));

const Hero: ComponentType<HeroProps> = withStyles(heroStyle)(
    ({ theme, classes }: HeroProps & WithStyles<typeof heroStyle>) => (
        <AppBar position={'static'}>
            <Toolbar>
                <SqlStreamStore color={'action'} />
                <Typography variant={'h6'} color={'inherit'}>
                    Sql Stream Store
                </Typography>
                <IconButton
                    onClick={onThemeToggle}
                    className={classes.themeToggle}
                >
                    {createElement(lightbulbs[theme.palette.type])}
                </IconButton>
            </Toolbar>
        </AppBar>
    ),
);

const SqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState
> = withAuthorization()(
    mount<SqlStreamStoreBrowserState & AuthorizationProps>(initialNavigation)(
        ({ loading, theme, ...props }) => (
            <MuiThemeProvider theme={theme}>
                <div>
                    <CssBaseline />
                    <Hero theme={theme} />
                    <Loading open={loading} />
                    <NavigationProvider onNavigate={onNavigate}>
                        <Viewer {...props} />
                        <Notifications />
                    </NavigationProvider>
                </div>
            </MuiThemeProvider>
        ),
    ),
);

const AuthorizedSqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState & AuthorizationProps
> = ({ authorization, ...props }) => (
    <AuthorizationProvider authorization={authorization}>
        <SqlStreamStoreBrowser {...props} />
    </AuthorizationProvider>
);

export default connect<SqlStreamStoreBrowserState, AuthorizationProps>(state$)(
    AuthorizedSqlStreamStoreBrowser,
);
