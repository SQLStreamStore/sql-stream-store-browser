import React from 'react';
import Remarkable from 'react-remarkable';
import { Typography } from '@material-ui/core';
import store from '../../store';
import { createState, connect } from '../../../reactive';

const body$ = store.body$.map(body => () => body);

const state$ = createState(
    body$.map(body => ['body', body])
);

const MarkdownViewer = ({ body }) => (
    <Typography>
        <Remarkable
            options={{
                typographer: true,
            }}
        >
            {body}
        </Remarkable>
    </Typography>
);
export default connect(state$)(MarkdownViewer);
