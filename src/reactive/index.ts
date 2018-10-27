import React, { Component, ComponentType } from 'react';

import { Observable, ReplaySubject, Subscription } from 'rxjs';

export const createAction = <T>() => new ReplaySubject<T>(1);

export const createState = <TState>(
    reducer$,
    initialState$ = Observable.of({}),
): Observable<TState> =>
    initialState$
        .merge(reducer$)
        .scan(
            // @ts-ignore
            (state, [scope, reducer]) =>
                // tslint:disable-next-line:no-object-literal-type-assertion
                ({
                    ...(state as object),
                    [scope]: reducer(state[scope]),
                } as TState),
        )
        .publishReplay(1)
        .refCount() as Observable<TState>;

export const connect = <TProps extends object, TState extends object>(
    state$: Observable<TState>,
) => (
    WrappedComponent: ComponentType<TProps & TState>,
): ComponentType<TProps> =>
    class extends Component<TProps, TState> {
        subscription: Subscription;

        componentWillMount() {
            this.subscription = state$.subscribe(s => {
                this.setState(s || {});
            });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            // tslint:disable-next-line:no-object-literal-type-assertion
            return React.createElement(WrappedComponent, {
                ...(this.state as object),
                ...(this.props as object),
            } as TProps & TState);
        }
    };
