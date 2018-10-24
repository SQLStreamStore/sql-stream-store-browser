import React, { ReactNode, StatelessComponent } from 'react';
import { NavigationHandler } from '../types';
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

const withNavigation = () => WrappedComponent => {
    const Component = props => (
        <Consumer>
            {onNavigate => (
                <WrappedComponent {...props} onNavigate={onNavigate} />
            )}
        </Consumer>
    );
    Component.displayName = getDisplayName('WithNavigation', WrappedComponent);
    return Component;
};

export { withNavigation };
