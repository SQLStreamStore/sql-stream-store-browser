import React from 'react';
import { Observable as obs } from 'rxjs';
import { TextField, FlatButton, AppBar, Menu, IconButton, MenuItem, Popover } from 'material-ui';
import { NavigationMenu } from 'material-ui/svg-icons';
import { Link } from 'react-router-dom';
import { ControlledTextField, Form, mount } from './components';
import { connect, createActions, createState } from './reactive';
import { getServerUrl, history } from './utils';

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
    obs.of({ server: getServerUrl(history.location) }));

const onOpenMenu = () => actions.open.next();

const onClose = () => actions.close.next();

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
            containerElement={<Link onClick={onClose} to={`/server?server=${server}`} />}
            label='Connect'
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
            onRequestClose={onClose}>
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