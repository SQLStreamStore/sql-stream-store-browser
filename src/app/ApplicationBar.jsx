import React from 'react';
import { Observable as obs } from 'rxjs';
import { TextField, FlatButton, AppBar, Menu, IconButton, MenuItem, Popover } from 'material-ui';
import { NavigationMenu } from 'material-ui/svg-icons';
import { ControlledTextField, Form, mount } from './components';
import { connect, createActions, createState } from './reactive';
import { getServerUrl, history } from './utils';

const actions = createActions(['changeServerAddress', 'open', 'connect']);

const serverAddress$ = actions.changeServerAddress.map(value => () => value);

const popover$ = obs.merge(
    actions.open.map(() => true),
    actions.connect.map(() => false)
).map(open => () => ({ open }));

const state$ = createState(
    obs.merge(
        serverAddress$.map(server => ['server', server]),
        popover$.map(popover => ['popover', popover])
    ),
    obs.of({ server: getServerUrl(history.location) }));

const onOpenMenu = () => actions.open.next();

const onChange = (_, value) => actions.changeServerAddress.next(value);

const ServerFinder = ({ server }) => (
    <Form>
        <TextField
            name='server'
            type='url'
            floatingLabelText='Server Address'
            hintText='http://sqlstreamstore.com'
            value={server || ''}
            onChange={onChange} />
        <br />
        <FlatButton 
            label='Connect'
            onClick={() => actions.connect.next(server)}
            style={{align: 'right'}} />
    </Form>);

const AppMenu = ({ server, popover }) => (
    <div>
        <IconButton onClick={onOpenMenu}>
            <NavigationMenu />
        </IconButton>
        <Popover 
            {...popover} 
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => actions.connect.next(server)}>
            <Menu disableAutoFocus>
                <MenuItem>
                    <ServerFinder server={server} />
                </MenuItem>
            </Menu>
        </Popover>        
    </div>);

export const ApplicationBar = props => (
    <AppBar iconElementLeft={<AppMenu {...props} />} />);

export default connect(state$)(ApplicationBar);

export { actions };