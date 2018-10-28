import React, { ComponentType, StatelessComponent } from 'react';
import Inspector, {
    NodeRendererProps,
    ObjectLabel,
    ObjectLabelProps,
    ObjectName,
    ObjectRootLabel,
} from 'react-inspector';

import { Observable as obs } from 'rxjs';
import { Hyperlink } from '../../../components';
import { connect, createState } from '../../../reactive';
import store from '../../store';
import { HalViewerProps } from './types';

interface UnregcognizedRelViewerState {
    data: object;
}
const state$ = createState<UnregcognizedRelViewerState>(
    store.body$.map(data => ['data', () => data]),
    obs.of<UnregcognizedRelViewerState>({
        data: {},
    }),
);

const MaybeLinkLabel: StatelessComponent<ObjectLabelProps> = ({
    name,
    data,
    ...props
}) =>
    name === 'href' ? (
        <span>
            <ObjectName name={name} />
            <span>: </span>
            <Hyperlink link={{ href: data }}>{data}</Hyperlink>
        </span>
    ) : (
        <ObjectLabel name={name} data={data} {...props} />
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
