import React, { createElement } from 'react';
import { Observable as obs } from 'rxjs';
import {
    IconButton, 
    Snackbar,
    SnackbarContent,
    withStyles
} from '@material-ui/core';
import {
    Close,
    CheckCircle,
    Warning,
    Error,
    Info,
} from '@material-ui/icons';
import { green, amber } from '@material-ui/core/colors';
import classNames from 'classnames';
import uuid from 'uuid';
import { actions } from '../stream-store';
import { 
    connect,
    createAction,
    createState,
} from '../reactive';

const iconsByVariant = {
    success: CheckCircle,
    warning: Warning,
    error: Error,
    info: Info,
};

const formatTitle = ({ status, statusText }) => `${status} ${statusText}`;

const formatSubheader = ({ title, type }) => (title ? `${title} (${type})` : null);

const formatContent = ({ detail }) => (detail
    ? detail
        .split(/\r|\n/)
        .filter(x => x.length)
        .reduce((akk, line, index) => ([
            ...akk,
            (<br key={index * 2} />),
            (
                <span key={(index * 2) + 1}>
                    {line}
                </span>),
        ]), [])
    : null);

const responses$ = obs.merge(
    actions.getResponse,
    actions.postResponse,
    actions.deleteResponse,
);

const clientError$ = responses$
    .filter(({ status }) => status >= 400 && status < 500)
    .map(({ body, ...response }) => ({
        variant: 'warning',
        title: formatTitle(response),
        subheader: formatSubheader(body),
        content: formatContent(body),
    }));

const serverError$ = responses$
    .filter(({ status }) => status >= 500)
    .map(({ body, ...response }) => ({
        variant: 'error',
        title: formatTitle(response),
        subheader: formatSubheader(body),
        content: formatContent(body),
    }));

const success$ = obs.merge(actions.postResponse, actions.deleteResponse)
    .filter(({ status }) => status < 400)
    .map(response => ({
        variant: 'info',
        title: formatTitle(response),
        timeout: 2000,
    }));

const dismiss = createAction(); 

const notification$ = obs.merge(
    clientError$,
    serverError$,
    success$,
).map(notification => ({
    ...notification,
    messageId: uuid.v4(),
}));

const state$ = createState(
    obs.merge(
        notification$.map(notification => [
            'notifications',
            notifications => [...notifications, notification] 
        ]),
        dismiss.map(messageId => [
            'notifications',
            notifications => notifications.filter(n => n.messageId !== messageId)
        ])
    ), obs.of({
        notifications: []
    })
);

const styles = theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
});

const Notification = withStyles(styles)(({
    classes,
    className,
    messageId,
    title,
    subheader,
    content,
    variant,
    ...other,
}) => (
    <Snackbar
        open
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
    >
        <SnackbarContent
            className={classNames(classes[variant], className)}
            message={
                <span className={classes.message}>
                    {createElement(iconsByVariant[variant], {
                        className:classNames(classes.icon, classes.iconVariant)
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
                    className={classes.close}
                    onClick={() => dismiss.next(messageId)}
                >
                    <Close className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    </Snackbar>));

const Notifications = ({ notifications }) => (
    <div>
        {notifications.map(notification => (
            <Notification 
                {...notification}
            />
        ))}
    </div>);

export default connect(state$)(Notifications);
