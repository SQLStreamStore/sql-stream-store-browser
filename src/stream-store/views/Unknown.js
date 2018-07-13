import React from 'react';
import { Observable as obs } from 'rxjs';
import Inspector, {
    ObjectLabel,
    ObjectRootLabel,
    ObjectName
 } from 'react-inspector';
import { createState, connect } from '../../reactive';
import store from '../store';
import { preventDefault } from '../../utils';
import { withAuthorization } from '../../components';
import theme from '../../theme';

const { palette } = theme;

const jsonViewerTheme = {
    base00: palette.background.default, // background
    base07: palette.text.primary, // text 
    base0B: '#859900', // string, date
    base03: '#657b83', //expanded
    base08: '#dc322f', // null, undefined, function, symbol, item string
    base09: '#cb4b16', //number, boolean
    base0D: '#268bd2', //label, arrow
}

const state$ = createState(
    store.body$.map(data => ['data', () => data]),
    obs.of({
        data: {
        },
    }),
);

const MaybeLinkLabel = ({ 
    name,
    data,
    onNavigate,
    authorization,
    ...props
}) => name === 'href'
    ? (
        <span>
            <ObjectName
                name={name}
                dimmed={props.isNonEnumerable}
            />
            <span>: </span>
            <a
                href={data}
                onClick={preventDefault(() => onNavigate(data, authorization))}>
                {data}
            </a>
        </span>)
    : (
        <ObjectLabel 
            name={name}
            data={data}
            {...props}
        />)


class UnknownRelViewer extends React.PureComponent {
    _nodeRenderer = ({ depth, ...props }) => depth === 0
        ? (
            <ObjectRootLabel
                {...props}
            />)
        : (
            <MaybeLinkLabel
                {...props}
                onNavigate={this.props.onNavigate}
                authorization={this.props.authorization}
            />);

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

export default withAuthorization(connect(state$)(UnknownRelViewer));