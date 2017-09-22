import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, hashHistory, Redirect } from 'react-router';

import Welcome from './Welcome.jsx';
import Main from './Main.jsx';
import Server, { AllStream, Stream, Index, StreamMessage } from './server';

const SqlStreamStoreBrowser = () => (
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <IndexRoute component={Welcome} />
            <Route path="/server" component={Server}>
                <IndexRoute component={Index} />
                <Route path="/server/stream" component={AllStream} />
                <Route path="/server/streams/:streamId">
                    <IndexRoute component={Stream}  />
                    <Route path="/server/streams/:streamId/:streamVersion" component={StreamMessage} />
                </Route>
            </Route>
        </Route>
    </Router>
);

export default SqlStreamStoreBrowser;