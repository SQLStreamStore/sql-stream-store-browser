import React, { Component } from 'react';

const mount = (didMount, willUnmount = () => {}) => WrappedComponent =>
    class Mount extends Component {
        componentDidMount() {
            didMount(this.props);
        }

        componentWillUnmount() {
            willUnmount(this.props);
        }

        render() {
            return React.createElement(WrappedComponent, { ...this.props });
        }
    };

export default mount;
