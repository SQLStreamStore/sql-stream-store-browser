import React from 'react';
import { Observable as obs } from 'rxjs';
import { 
    TextField,
    Button,
    AppBar,
    IconButton,
    Menu,
    MenuItem,
    Popover,
    Toolbar
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { Form } from './components';
import { connect, createActions, createState } from './reactive';
import { getServerUrl, history } from './utils';

const actions = createActions(['changeServerAddress', 'open', 'connect']);

const serverAddress$ = actions.changeServerAddress.map(value => () => value);

const menu$ = obs.merge(
    actions.open.map(() => true),
    actions.connect.map(() => false)
).map(open => () => ({ open }));

const state$ = createState(
    obs.merge(
        serverAddress$.map(server => ['server', server]),
        menu$.map(menu => ['menu', menu])
    ),
    obs.of({ 
        server: getServerUrl(history.location), 
        menu: {
            open: false
        }
    }));

const onOpenMenu = () => actions.open.next();

const onChange = ({ target }) => actions.changeServerAddress.next(target.value);

const ServerFinder = ({ server }) => (
    <Form>
        <TextField
            name='server'
            type='url'
            placeholder='http://sqlstreamstore.com'
            value={server || ''}
            onChange={onChange}>
            Server Address
        </TextField>
        <br />
        <Button 
            variant="flat"
            onClick={() => actions.connect.next(server)}
            style={{align: 'right'}}>
            Connect
        </Button>
    </Form>);

const AppMenu = ({ server, menu }) => (
    <Toolbar>
        <IconButton onClick={onOpenMenu}>
            <MenuIcon />
        </IconButton>
        <Menu
            disableAutoFocus
            {...menu} 
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onClose={() => actions.connect.next(server)}            
        >
            <MenuItem>
                <ServerFinder server={server} />
            </MenuItem>
        </Menu>
    </Toolbar>);

export const ApplicationBar = props => (
    <AppBar position='static'>
        <AppMenu {...props} />
    </AppBar>);

export default connect(state$)(ApplicationBar);

export { actions };