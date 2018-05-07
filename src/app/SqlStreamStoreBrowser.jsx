import React from 'react';
import PropTypes from 'prop-types';
import { 
    Redirect,
    Router,
    Route,
    Switch } from 'react-router';
import { history } from './utils';

import Welcome from './Welcome.jsx';
import Main from './Main.jsx';
import Server, { 
    AllStream,
    Stream,
    Index,
    StreamMessage
} from './server';

const SqlStreamStoreBrowser = () => (
    <Router history={history}>
        <Main>
            <Route exact path="/" component={Welcome}  />
            <Server>
                <Route exact path="/server" component={Index} />
                <Route exact path="/server/stream" component={AllStream} />
                <Route exact path="/server/streams/:streamId" component={Stream} />
                <Route exact path="/server/streams/:streamId/:streamVersion" component={StreamMessage} />
            </Server>
        </Main>
    </Router>
);

export default SqlStreamStoreBrowser;