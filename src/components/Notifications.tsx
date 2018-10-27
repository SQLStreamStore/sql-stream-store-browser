import {
    IconButton,
    Snackbar,
    SnackbarContent,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';
import classNames from 'classnames';
import React, {ComponentType, createElement, ReactNode, StatelessComponent} from 'react';
import { Observable as obs } from 'rxjs';
import uuid from 'uuid';
import { CheckCircle, Close, Error, Info, Warning } from '../components/Icons';
import { connect, createAction, createState } from '../reactive';
import { actions } from '../stream-store';
import { HttpProblemDetailsResponse, HttpResponse } from '../types';

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
    title ? `${title} (${type})` : null;

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

const responses$ = obs.merge(
    ...Object.keys(actions).map(verb => actions[verb].response),
);

const clientError$ = responses$
    .filter(({ status }) => status >= 400 && status < 500)
    .map(({ body, ...response }: HttpProblemDetailsResponse) => ({
        content: formatContent(body),
        subheader: formatSubheader(body),
        title: formatTitle(response),
        variant: 'warning',
    }));

const serverError$ = responses$
    .filter(({ status }) => status >= 500)
    .map(({ body, ...response }: HttpProblemDetailsResponse) => ({
        content: formatContent(body),
        subheader: formatSubheader(body),
        title: formatTitle(response),
        variant: 'error',
    }));

const unsafe = Object.keys(actions)
    .filter(verb => verb !== 'get')
    .map(verb => actions[verb].response);

const success$ = obs
    .merge(...unsafe)
    .filter(({ status }) => status < 400)
    .map((response: HttpResponse) => ({
        autoHideDuration: 2000,
        title: formatTitle(response),
        variant: 'success',
    }));

const dismiss = createAction();

const notification$ = obs
    .merge(clientError$, serverError$, success$)
    .map(notification => ({
        ...notification,
        messageId: uuid.v4(),
    }));

const state$ = createState(
    obs.merge(
        notification$.map(notification => [
            'notifications',
            notifications => [...notifications, notification],
        ]),
        dismiss.map(messageId => [
            'notifications',
            notifications =>
                notifications.filter(n => n.messageId !== messageId),
        ]),
    ),
    obs.of({
        notifications: [],
    }),
);

const styles = theme => ({
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

interface NotificationProps {
    autoHideDuration: number | undefined;
    className: string;
    content: ReactNode;
    messageId: string;
    subheader: string;
    title: string;
    variant: string;
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
                        {createElement(iconsByVariant[variant], {
                            className: classNames(
                                classes.icon,
                                classes.iconVariant,
                            ),
                        })}
                        {title} {subheader}
                        <br />
                        {content}
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        color="inherit"
                        onClick={() => dismiss.next(messageId)}
                    >
                        <Close className={classes.icon} />
                    </IconButton>,
                ]}
                {...other}
            />
        </Snackbar>
    ),
);

const Notifications: StatelessComponent<{ notifications: NotificationProps[] }> = ({ notifications }) => (
    <div>
        {notifications.map(notification => (
            <Notification key={notification.messageId} {...notification} />
        ))}
    </div>
);

export default connect(state$)(Notifications);
