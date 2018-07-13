import React from 'react';

const { Consumer, Provider } = React.createContext();

const AuthorizationProvider = ({ authorization, children }) => (
    <Provider value={authorization}>{children}</Provider>
);

export default AuthorizationProvider;

export const withAuthorization = WrappedComponent => props => (
    <Consumer>
        {authorization => (
            <WrappedComponent {...props} authorization={authorization} />
        )}
    </Consumer>
);
