import React, { PureComponent } from 'react';
import getDisplayName from './getDisplayName';

const mount = (didMount, willUnmount = () => {}) => WrappedComponent => {
    class Mount extends PureComponent {
        componentDidMount() {
            didMount(this.props);
        }

        componentWillUnmount() {
            willUnmount(this.props);
        }

        render() {
            return React.createElement(WrappedComponent, { ...this.props });
        }
    }

    Mount.displayName = getDisplayName('Mount', WrappedComponent);

    return Mount;
};

mount.displayName = 'Mount';

export default mount;
