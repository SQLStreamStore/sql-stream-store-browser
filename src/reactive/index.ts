import React, { Component, ComponentType } from 'react';
import { merge, Observable, ReplaySubject, Subscription } from 'rxjs';
import { publishReplay, refCount, scan, tap } from 'rxjs/operators';

export const createAction = <T>() => new ReplaySubject<T>(1);

export const createState = <TState extends object>(
    reducer$: Observable<any>,
    initialState$: Observable<TState>,
): Observable<TState> =>
    merge(initialState$, reducer$).pipe(
        scan(
            // @ts-ignore
            (state, [scope, reducer]) =>
                // tslint:disable-next-line:no-object-literal-type-assertion
                ({
                    ...(state as object),
                    [scope]: reducer(state[scope]),
                } as TState),
        ),
        publishReplay(1),
        refCount(),
    );

const createLogger = <TState>() => (state: TState) =>
    // tslint:disable-next-line:no-console
    console.debug(state, typeof state);

export const connect = <TState extends object, TProps extends object = {}>(
    state$: Observable<TState>,
) => (
    WrappedComponent: ComponentType<TProps & TState>,
): ComponentType<TProps> =>
    class extends Component<TProps, TState> {
        subscription: Subscription;

        componentWillMount() {
            const log = createLogger<TState>();
            this.subscription = state$.pipe(tap(log)).subscribe(s => {
                this.setState(s);
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
