import { ColorScheme } from 'base16';
import { withNavigation } from 'components';
import React from 'react';
import ReactJson, { OnSelectProps } from 'react-json-view';
import { connect, createState } from 'reactive';
import { merge as observableMerge, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import store from 'stream-store/store';
import themes from 'themes';
import { NavigatableProps } from 'types';
import { reactJsonTheme } from 'utils';
import { HalViewerProps } from './types';

const isHyperlink = (
    name: string | null,
    namespace: Array<string | null>,
): boolean =>
    name === 'href' && namespace.filter(n => n === '_links').length > 0;

interface UnrecognizedRelViewerState {
    src: object;
    theme: ColorScheme;
}
const state$ = createState<UnrecognizedRelViewerState>(
    observableMerge(
        store.hal$.body$.pipe(map(src => ['src', () => src])),
        themes.theme$.pipe(
            map(({ palette: { type } }) => [
                'theme',
                () => reactJsonTheme(type),
            ]),
        ),
    ),
    observableOf<UnrecognizedRelViewerState>({
        src: {},
        theme: reactJsonTheme(),
    }),
);

const UnrecognizedRelViewer = withNavigation<
    UnrecognizedRelViewerState & HalViewerProps
>()(
    class extends React.PureComponent<
        UnrecognizedRelViewerState & HalViewerProps & NavigatableProps
    > {
        _handlePotentialNavigation = ({
            name,
            value,
            namespace,
        }: OnSelectProps) => {
            const { authorization, onNavigate } = this.props;
            if (!isHyperlink(name, namespace)) {
                return;
            }

            onNavigate(
                {
                    href: value as string,
                },
                authorization,
            );
        };

        render() {
            return (
                <ReactJson
                    {...this.props}
                    onSelect={this._handlePotentialNavigation}
                />
            );
        }
    },
);

export default connect<UnrecognizedRelViewerState, HalViewerProps>(state$)(
    UnrecognizedRelViewer,
);
