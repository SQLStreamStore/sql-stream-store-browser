import React from 'react';
import { Observable as obs } from 'rxjs';
import { TextField, FlatButton, AppBar, Menu, IconButton, MenuItem, Popover } from 'material-ui';
import { NavigationMenu } from 'material-ui/svg-icons';
import { Link, hashHistory } from 'react-router';
import { Form, mount } from './components';
import { connect, createActions, createState } from './reactive';
import { getServerUrl } from './utils';

const actions = createActions(['changeServerAddress', 'open', 'close']);

const serverAddress$ = actions.changeServerAddress.map(value => () => value);

const popover$ = obs.merge(
    actions.open.map(() => true),
    actions.close.map(() => false)
).map(open => () => ({ open }));

const state$ = createState(
    obs.merge(
        serverAddress$.map(server => ['server', server]),
        popover$.map(popover => ['popover', popover])
    ),
    obs.of({ server: getServerUrl(hashHistory.getCurrentLocation()) }));

const ServerFinder = ({ server }) => (
    <Form>
        <TextField 
            name='server'
            type='url'
            floatingLabelText='Server Address'
            hintText='http://sqlstreamstore.com'
            value={server}
            onChange={(_, value) => actions.changeServerAddress.next(value)} />
        <br />
        <FlatButton 
            containerElement={<Link to={`/server?server=${server}`} />}
            label='Connect'
            style={{align: 'right'}} />
    </Form>);

ServerFinder.defaultProps = {
    server: ''
};

const AppMenu = ({ server, popover }) => (
    <div>
        <IconButton onClick={() => actions.open.next()}>
            <NavigationMenu />
        </IconButton>
        <Popover 
            {...popover} 
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => actions.close.next()}>
            <Menu>
                <MenuItem>
                    <ServerFinder server={server} />
                </MenuItem>
            </Menu>
        </Popover>        
    </div>);

export const ApplicationBar = props => (
    <AppBar iconElementLeft={<AppMenu {...props} />} />);

export default connect(state$)(ApplicationBar);