import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Rx from 'rxjs';

export const createAction = () => new Rx.Subject();

export const createActions = actionNames =>
    actionNames.reduce((akk, name) => ({ ...akk, [name]: createAction() }), {});

export const createState = (reducer$, initialState$ = Rx.Observable.of({})) => initialState$
    .merge(reducer$)
    .scan((state, [scope, reducer]) => ({ ...state, [scope]: reducer(state[scope]) }))
    .publishReplay(1)
    .refCount();

export const connect = (state$, selector = state => state) => WrappedComponent => class Connect extends Component {
    componentWillMount() {
        this.subscription = state$.subscribe(s => this.setState(s));
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return React.createElement(WrappedComponent, { ...this.state, ...this.props });
    }
};
