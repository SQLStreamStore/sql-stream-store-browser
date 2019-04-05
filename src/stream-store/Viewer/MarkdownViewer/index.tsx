import { Typography } from '@material-ui/core';
import React, { ComponentType } from 'react';
import Remarkable from 'react-remarkable';
import { connect, createState } from 'reactive';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import store from 'stream-store/store';

const body$ = store.markdown$.body$.pipe(map(body => () => body));

interface MarkdownViewerState {
    body: string;
}
const state$ = createState<MarkdownViewerState>(
    body$.pipe(map(body => ['body', body])),
    observableOf<MarkdownViewerState>({
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
