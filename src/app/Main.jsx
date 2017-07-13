import React, { Component } from 'react';
import theme from './theme';
import { MuiThemeProvider, getMuiTheme }  from 'material-ui/styles';
import ApplicationBar from './ApplicationBar.jsx';
import { getServerUrl } from './utils';

const muiTheme = getMuiTheme(theme);

const Main = ({ children, location }) => (
    <MuiThemeProvider muiTheme={muiTheme} >
        <div>
            <ApplicationBar />
            {children}
        </div>
    </MuiThemeProvider>);

export default Main;