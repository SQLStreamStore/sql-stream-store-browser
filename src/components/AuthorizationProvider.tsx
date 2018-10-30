import React, { ComponentType, ReactNode, StatelessComponent } from 'react';
import { AuthorizationProps } from '../types';
import getDisplayName from './getDisplayName';

const { Consumer, Provider } = React.createContext<string | undefined>(
    undefined,
);

const AuthorizationProvider: StatelessComponent<
    AuthorizationProps & {
        children: ReactNode;
    }
> = ({ authorization, children }) => (
    <Provider value={authorization}>{children}</Provider>
);

export default AuthorizationProvider;

const withAuthorization = () => <T extends object>(
    WrappedComponent: ComponentType<T & AuthorizationProps>,
) => {
    const Component = (props: T) => (
        <Consumer>
            {authorization => (
                <WrappedComponent {...props} authorization={authorization} />
            )}
        </Consumer>
    );
    Component.displayName = getDisplayName(
        'WithAuthorization',
        WrappedComponent,
    );
    return Component as ComponentType<T>;
};

export { withAuthorization };
