import React from 'react';
import getDisplayName from './getDisplayName';
const { Consumer, Provider } = React.createContext();

const NavigationProvider = ({ onNavigate, children }) => (
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
