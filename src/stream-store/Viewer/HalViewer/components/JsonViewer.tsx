import { Drawer, WithStyles, withStyles } from '@material-ui/core';
import { ColorScheme } from 'base16';
import { StreamBrowser, withNavigation } from 'components';
import React, { ComponentType, PureComponent } from 'react';
import ReactJson from 'react-json-view';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import rels from 'stream-store/rels';
import themes from 'themes';
import { HalResource, HttpResponse, NavigatableProps } from 'types';
import uriTemplate from 'uri-template';
import { hal, http, reactJsonTheme } from 'utils';

const isPotentialStreamId = (data: any) =>
    typeof data === 'number' || typeof data === 'string';

const getStreamLinks = ({ _embedded }: HalResource): HalResource[] =>
    _embedded[rels.feed] || [];

interface JsonViewerState {
    streams: HalResource[];
    loading: boolean;
    open: boolean;
}

const style = {
    drawerPaper: {
        width: 480,
    },
    streamId: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
};

interface JsonViewerProps {
    json?: object;
}

interface ThemedJsonViewerState {
    theme: ColorScheme;
}

class JsonViewer extends PureComponent<
    JsonViewerProps &
        ThemedJsonViewerState &
        NavigatableProps &
        HalResource &
        WithStyles<typeof style>,
    JsonViewerState
> {
    state: JsonViewerState = {
        loading: false,
        open: false,
        streams: [],
    };

    _handlePotentialStreamIdClick = async ({
        value: pattern,
    }: {
        value: object | string | number | boolean | null;
    }): Promise<void> => {
        if (!isPotentialStreamId(pattern)) {
            return;
        }

        const { authorization, _links } = this.props;

        this.setState({
            loading: true,
            open: true,
        });

        if (!_links || !_links[rels.browse]) {
            return;
        }

        const template = uriTemplate.parse(
            decodeURI(_links[rels.browse][0].href),
        );

        const responses = await Promise.all(
            [...new Set([pattern, String(pattern).replace(/-/g, '')])].map(p =>
                http.get({
                    headers: { authorization },
                    link: {
                        href: template.expand({ p, t: 'e' }),
                    },
                }),
            ),
        );

        const streams = this._getStreams(responses);

        this.setState({
            loading: false,
            streams,
        });
    };

    _getStreams = (responses: HttpResponse[]) =>
        Object.values(
            responses
                .flatMap(({ body }) =>
                    getStreamLinks(hal.normalizeResource(body as HalResource)),
                )
                .map(({ _links, ...resource }) => ({
                    ...resource,
                    _links: hal.resolveLinks('../../', _links),
                })),
        );

    _handlePotentialStreamIdClose = () =>
        this.setState({
            open: false,
        });

    render() {
        const { json, classes, theme } = this.props;

        if (!json) {
            return null;
        }

        const { streams, loading, open } = this.state;

        return (
            <div className={classes.drawerPaper}>
                <ReactJson
                    name={null}
                    src={json}
                    theme={theme}
                    onSelect={this._handlePotentialStreamIdClick}
                />
                <Drawer
                    variant={'temporary'}
                    open={open}
                    onClose={this._handlePotentialStreamIdClose}
                    anchor={'right'}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <StreamBrowser streams={streams} loading={loading} />
                </Drawer>
            </div>
        );
    }
}

const state$ = createState<ThemedJsonViewerState>(
    themes.theme$.pipe(
        map(({ palette: { type } }) => ['theme', () => reactJsonTheme(type)]),
    ),
    observableOf<ThemedJsonViewerState>({
        theme: reactJsonTheme(),
    }),
);

const ThemedJsonViewer = connect<ThemedJsonViewerState, JsonViewerProps>(
    state$,
)(JsonViewer);

export default withNavigation<
    HalResource & JsonViewerProps & ThemedJsonViewerState
>()(withStyles(style)(ThemedJsonViewer) as ComponentType<
    JsonViewerProps & ThemedJsonViewerState & NavigatableProps & HalResource
>) as ComponentType<JsonViewerProps>;
