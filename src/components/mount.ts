import React, { ComponentType, PureComponent } from 'react';
import getDisplayName from './getDisplayName';

type DidMount<T> = (props: T) => void;
type WillUnmount<T> = (props: T) => void;

const mount = <T extends object>(
    didMount: DidMount<T>,
    willUnmount?: WillUnmount<T>,
) => (WrappedComponent: ComponentType<T>) => {
    class Mount extends PureComponent<T> {
        componentDidMount() {
            didMount(this.props);
        }

        componentWillUnmount() {
            if (!willUnmount) {
                return;
            }
            willUnmount(this.props);
        }

        render() {
            return React.createElement<T>(WrappedComponent, this.props);
        }
    }

    return Mount;
};

mount.displayName = 'Mount';

export default mount;
