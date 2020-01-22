import { JSONSchema7 } from 'json-schema';
import React, { ComponentType, useEffect } from 'react';
import { Observable as obs } from 'rxjs';
import {
    AuthorizationProvider,
    NavigationProvider,
    Notifications,
    withAuthorization,
} from './components/index';
import { connect, createState } from './reactive';
import { actions, store, Viewer } from './stream-store';
import { AuthorizationProps, HalLink, HalLinks } from './types';
import { mediaTypes } from './utils';

const getSelfAlias = (links: HalLinks) =>
    Object.keys(links)
        .flatMap(rel => links[rel])
        .filter(({ rel }) => rel && rel.indexOf('streamStore:') === 0)
        .filter(
            ({ href }) =>
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
    _links: HalLinks;
    self: HalLink;
    forms: { [rel: string]: JSONSchema7 };
}
const state$ = createState<SqlStreamStoreBrowserState>(
    obs.merge(
        self$.map(self => ['self', () => self]),
        store.hal$.links$.map(links => ['_links', () => links]),
        store.hal$.forms$.map(forms => ['forms', () => forms]),
        store.hal$.loading$.map(loading => ['loading', () => loading]),
        store.mediaType$.map(mediaType => ['mediaType', () => mediaType]),
    ),
    obs.of({
        _links: {},
        forms: {},
        loading: false,
        mediaType: mediaTypes.hal,
        self: {
            href: '',
        },
    }),
);

const onNavigate = (link: HalLink, authorization: string | undefined) => {
    if (link.href.indexOf('#') === -1) {
        actions.get.request.next({ link, headers: { authorization } });
    }
};

interface EmbeddedBrowserProps {
    currentUrl: string;
    mediaType:
        | '*/*'
        | 'application/hal+json'
        | 'application/json'
        | 'text/markdown';
}

const EmbeddedSqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState & AuthorizationProps & EmbeddedBrowserProps
> = withAuthorization()(({ ...props }) => {
    useEffect(() => {
        onNavigate(
            { href: props.currentUrl, type: props.mediaType },
            props.authorization,
        );
    }, []);

    return (
        <NavigationProvider onNavigate={onNavigate}>
            <Viewer {...props} />
            <Notifications />
        </NavigationProvider>
    );
});

const AuthorizedSqlStreamStoreBrowser: ComponentType<
    SqlStreamStoreBrowserState & AuthorizationProps & EmbeddedBrowserProps
> = ({ authorization, ...props }) => (
    <AuthorizationProvider authorization={authorization}>
        <EmbeddedSqlStreamStoreBrowser {...props} />
    </AuthorizationProvider>
);

export default connect<
    SqlStreamStoreBrowserState,
    AuthorizationProps & EmbeddedBrowserProps
>(state$)(AuthorizedSqlStreamStoreBrowser);
