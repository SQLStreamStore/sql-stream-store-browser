import React, { ComponentType, ReactNode, StatelessComponent } from 'react';
import { NavigatableProps, NavigationHandler } from 'types';
import getDisplayName from './getDisplayName';

const defaultNavigationHandler: NavigationHandler = (link, authorization) => {
    return;
};

const { Consumer, Provider } = React.createContext<NavigationHandler>(
    defaultNavigationHandler,
);

const NavigationProvider: StatelessComponent<{
    onNavigate: NavigationHandler;
    children: ReactNode;
}> = ({ onNavigate, children }) => (
    <Provider value={onNavigate}>{children}</Provider>
);

export default NavigationProvider;

const withNavigation = <T extends object>() => (
    WrappedComponent: ComponentType<T & NavigatableProps>,
) => {
    const Component = (props: T) => (
        <Consumer>
            {onNavigate => (
                <WrappedComponent {...props} onNavigate={onNavigate} />
            )}
        </Consumer>
    );
    Component.displayName = getDisplayName('WithNavigation', WrappedComponent);
    return Component as ComponentType<T & NavigatableProps>;
};

export { withNavigation };
