import { Typography } from '@material-ui/core';
import React, { ComponentType } from 'react';
import Remarkable from 'react-remarkable';
import { Observable } from 'rxjs';
import { connect, createState } from '../../../reactive';
import store from '../../store';

const body$ = store.markdown$.body$.map(body => () => body);

interface MarkdownViewerState {
    body: string;
}
const state$ = createState<MarkdownViewerState>(
    body$.map(body => ['body', body]),
    Observable.of<MarkdownViewerState>({
        body: '',
    }),
);

const MarkdownViewer: ComponentType<MarkdownViewerState> = ({ body }) => (
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
export default connect<{}, MarkdownViewerState>(state$)(MarkdownViewer);
