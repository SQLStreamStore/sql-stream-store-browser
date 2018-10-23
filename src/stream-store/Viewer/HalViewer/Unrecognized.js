import React from 'react';
import { Observable as obs } from 'rxjs';
import Inspector, {
    ObjectLabel,
    ObjectRootLabel,
    ObjectName,
} from 'react-inspector';
import { createState, connect } from '../../../reactive';
import store from '../../store';
import { Hyperlink } from '../../../components';

const state$ = createState(
    store.body$.map(data => ['data', () => data]),
    obs.of({
        data: {},
    }),
);

const MaybeLinkLabel = ({ name, data, ...props }) =>
    name === 'href' ? (
        <span>
            <ObjectName name={name} dimmed={props.isNonEnumerable} />
            <span>: </span>
            <Hyperlink link={{ href: data }}>{data}</Hyperlink>
        </span>
    ) : (
        <ObjectLabel name={name} data={data} {...props} />
    );

class UnrecognizedRelViewer extends React.PureComponent {
    _nodeRenderer = ({ depth, ...props }) =>
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

export default connect(state$)(UnrecognizedRelViewer);
