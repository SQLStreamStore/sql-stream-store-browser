import { Typography } from '@material-ui/core';
import React, { ComponentType } from 'react';
import Remarkable from 'react-remarkable';
import { connect, createState } from './../../../reactive';
import { Observable } from 'rxjs';
import store from './../../../stream-store/store';

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
export default connect<MarkdownViewerState>(state$)(MarkdownViewer);
