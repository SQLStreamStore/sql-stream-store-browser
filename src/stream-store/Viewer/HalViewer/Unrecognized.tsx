import { ColorScheme } from 'base16';
import React from 'react';
import ReactJson, { OnSelectProps } from 'react-json-view';
import { Observable as obs } from 'rxjs';
import themes from '../../../themes';
import { withNavigation } from './../../../components';
import { connect, createState } from './../../../reactive';
import store from './../../../stream-store/store';
import { NavigatableProps } from './../../../types';
import { reactJsonTheme } from './../../../utils';
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
    obs.merge(
        store.hal$.body$.map(src => ['src', () => src]),
        themes.theme$.map(({ palette: { type } }) => [
            'theme',
            () => reactJsonTheme(type),
        ]),
    ),
    obs.of<UnrecognizedRelViewerState>({
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
