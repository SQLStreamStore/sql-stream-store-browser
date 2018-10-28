import React, { ComponentType, StatelessComponent } from 'react';
import Inspector, {
    NodeRendererProps,
    ObjectLabel,
    ObjectLabelProps,
    ObjectName,
    ObjectRootLabel,
} from 'react-inspector';

import { Observable as obs } from 'rxjs';
import { withNavigation } from '../../../components';
import { connect, createState } from '../../../reactive';
import { NavigatableProps } from '../../../types';
import { preventDefault } from '../../../utils';
import store from '../../store';
import { HalViewerProps } from './types';

interface UnregcognizedRelViewerState {
    data: object;
}
const state$ = createState<UnregcognizedRelViewerState>(
    store.hal$.body$.map(data => ['data', () => data]),
    obs.of<UnregcognizedRelViewerState>({
        data: {},
    }),
);

const MaybeLinkLabel: StatelessComponent<ObjectLabelProps> = withNavigation()(
    ({
        authorization,
        name,
        data,
        onNavigate,
        ...props
    }: ObjectLabelProps & NavigatableProps) =>
        name === 'href' ? (
            <span>
                <ObjectName name={name} />
                <span>: </span>
                <a
                    href={data}
                    onClick={preventDefault(() =>
                        onNavigate({ href: data }, authorization),
                    )}
                >
                    {data}
                </a>

                {data}
            </span>
        ) : (
            <ObjectLabel name={name} data={data} {...props} />
        ),
);

class UnrecognizedRelViewer extends React.PureComponent<
    UnregcognizedRelViewerState
> {
    _nodeRenderer = ({ depth, ...props }: NodeRendererProps) =>
        depth === 0 ? (
            <ObjectRootLabel {...props} />
        ) : (
            <MaybeLinkLabel {...props} />
        );

    render() {
        return (
            <Inspector
                {...this.props}
                nodeRenderer={this._nodeRenderer}
                expandLevel={32}
            />
        );
    }
}

export default connect(state$)(UnrecognizedRelViewer) as ComponentType<
    HalViewerProps
>;
