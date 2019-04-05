import { merge as observableMerge, of as observableOf } from 'rxjs';

import {
    IconButton,
    Snackbar,
    SnackbarContent,
    Theme,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';
import classNames from 'classnames';
import { CheckCircle, Close, Error, Info, Warning } from 'icons';
import React, { ComponentType, createElement, ReactNode } from 'react';
import { connect, createAction, createState } from 'reactive';
import { filter, map } from 'rxjs/operators';
import { actions } from 'stream-store';
import { HttpProblemDetailsResponse, HttpResponse } from 'types';
import { http } from 'utils';
import uuid from 'uuid';

const iconsByVariant = {
    error: Error,
    info: Info,
    success: CheckCircle,
    warning: Warning,
};

const formatTitle = ({
    status,
    statusText,
}: {
    status: number;
    statusText: string;
}) => `${status} ${statusText}`;

const formatSubheader = ({ title, type }: { title: string; type: string }) =>
    title ? `${title} (${type})` : undefined;

const formatContent = ({ detail }: { detail?: string }): ReactNode[] =>
    !!detail
        ? detail
              .split(/\r|\n/)
              .filter(x => x.length)
              .reduce(
                  (akk, line, index) => [
                      ...akk,
                      <br key={index * 2} />,
                      <span key={index * 2 + 1}>{line}</span>,
                  ],
                  [],
              )
        : [];

interface Notification {
    content: ReactNode;
    subheader?: string;
    title: string;
    variant: keyof typeof iconsByVariant;
}

const verbs: HttpVerb[] = Object.keys(actions) as HttpVerb[];

const responses$ = observableMerge(
    ...verbs.map(verb => actions[verb].response),
);

const clientError$ = responses$.pipe(
    filter(({ status }) => status >= 400 && status < 500),
    map(
        ({ body, ...response }: HttpProblemDetailsResponse): Notification => ({
            content: formatContent(body),
            subheader: formatSubheader(body),
            title: formatTitle(response),
            variant: 'warning',
        }),
    ),
);

const serverError$ = responses$.pipe(
    filter(({ status }) => status >= 500),
    map(
        ({ body, ...response }: HttpProblemDetailsResponse): Notification => ({
            content: formatContent(body),
            subheader: formatSubheader(body),
            title: formatTitle(response),
            variant: 'error',
        }),
    ),
);

type HttpVerb = keyof typeof http;

const unsafe = verbs
    .filter(verb => verb !== 'get')
    .map(verb => actions[verb].response);

const success$ = observableMerge(...unsafe).pipe(
    filter(({ status }) => status < 400),
    map((response: HttpResponse) => ({
        autoHideDuration: 2000,
        title: formatTitle(response),
        variant: 'success',
    })),
);

const dismiss = createAction<string>();

const notification$ = observableMerge(
    clientError$,
    serverError$,
    success$,
).pipe(
    map(notification => ({
        ...notification,
        messageId: uuid.v4(),
    })),
);

interface NotificationState extends Notification {
    messageId: string;
}
interface NotificationsState {
    notifications: NotificationState[];
}

const state$ = createState<NotificationsState>(
    observableMerge(
        notification$.pipe(
            map((notification: NotificationState) => [
                'notifications',
                (notifications: NotificationState[]): NotificationState[] => [
                    ...notifications,
                    notification,
                ],
            ]),
        ),
        dismiss.pipe(
            map(messageId => [
                'notifications',
                (notifications: NotificationState[]): NotificationState[] =>
                    notifications.filter(n => n.messageId !== messageId),
            ]),
        ),
    ),
    observableOf<NotificationsState>({
        notifications: [],
    }),
);

const styles = (theme: Theme) => ({
    error: {
        backgroundColor: red[500],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        marginRight: theme.spacing.unit,
        opacity: 0.9,
    },
    info: {
        backgroundColor: blue[500],
    },
    message: {
        alignItems: 'center',
        display: 'flex',
    },
    success: {
        backgroundColor: green[600],
    },
    warning: {
        backgroundColor: amber[700],
    },
});

interface NotificationProps extends NotificationState {
    autoHideDuration: number | undefined;
    className: string;
}

const Notification: ComponentType<NotificationProps> = withStyles(styles)(
    ({
        autoHideDuration,
        className,
        classes,
        content,
        messageId,
        subheader,
        title,
        variant,
        ...other
    }: NotificationProps & WithStyles<typeof styles>) => (
        <Snackbar
            open
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
            }}
            autoHideDuration={autoHideDuration}
        >
            <SnackbarContent
                className={classNames(classes[variant], className)}
                message={
                    <span className={classes.message}>
                        <Typography variant={'body2'}>
                            {createElement(iconsByVariant[variant], {
                                className: classNames(
                                    classes.icon,
                                    classes.iconVariant,
                                ),
                            })}
                            {title} {subheader}
                            <br />
                            {content}
                        </Typography>
                    </span>
                }
                action={[
                    <IconButton
                        key={'close'}
                        color={'inherit'}
                        onClick={() => dismiss.next(messageId)}
                    >
                        <Typography variant={'body2'}>
                            <Close className={classes.icon} />
                        </Typography>
                    </IconButton>,
                ]}
                {...other}
            />
        </Snackbar>
    ),
);

interface NotificationsProps {
    notifications: NotificationProps[];
}

const Notifications: ComponentType<NotificationsProps> = ({
    notifications = [],
}) => (
    <div>
        {notifications.map(notification => (
            <Notification key={notification.messageId} {...notification} />
        ))}
    </div>
);

export default connect<NotificationsState>(state$)(Notifications);
