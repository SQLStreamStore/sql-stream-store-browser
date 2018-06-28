import React from 'react';
import { Observable as obs } from 'rxjs';
import { Avatar, withStyles } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { green, yellow, red } from '@material-ui/core/colors';
import {
    NotificationProvider,
    showNotification
  } from 'mui-notifications';
import { actions } from '../stream-store';


const styles = ({
    avatarInfo: {
      backgroundColor: green[500]
    },
    avatarWarning: {
      backgroundColor: yellow[500]
    },
    avatarError: {
      backgroundColor: red[500]
    },
    infoCard: {
      border: `solid 1px ${green[500]}`
    },
    warningCard: {
      border: `solid 1px ${yellow[500]}`
    },
    errorCard: {
      border: `solid 1px ${red[500]}`
    }
});

const responses$ = obs.merge(
    actions.getResponse,
    actions.postResponse
);

const clientError$ = responses$
    .filter(({ status }) => status >= 400 && status < 500)
    .map(({ statusText, status, body = { title, type, detail, ...body } }) => ({
        variant: 'warning',
        status,
        statusText,
    }));

const serverError$ = responses$
    .filter(({ status }) => status >= 500)
    .map(({ statusText, status, body = { title, type, detail, ...body } }) => ({
        variant: 'error',
        status,
        statusText,
    }));

const success$ = actions.postResponse
    .filter(({ status }) => status < 400 )
    .map(({ status, statusText }) => ({
        varant: 'info',
        status,
        statusText,
    }));

const avatarsByVariant = {
    'error': () => (
        <Avatar style={styles.avatarError}>
            <Icons.Error />
        </Avatar>),
    'warning': () => (
        <Avatar style={styles.avatarWarning}>
            <Icons.Warning />
        </Avatar>),
    'info': () => (
        <Avatar style={styles.avatarInfo}>
            <Icons.Info />
        </Avatar>),
};

const notification$ = obs.merge(
    clientError$,
    serverError$,
    success$
).map(({
    variant,
    status,
    statusText,
    type,
    title,
    detail
}) => {
    const Alert = avatarsByVariant[variant];

    return {
        title: `${status} ${statusText}`,
        subheader: type,
        content: title,
        timeout: 2000,
        avatar: <Alert />
    };
});

notification$.subscribe(notification => showNotification(() => notification));

const Notifications = () => (
    <NotificationProvider
        desktop
        transitionName={{
            leave: 'dummy',
            leaveActive: 'fadeOut',
            appear: 'dummy',
            appearActive: 'zoomInUp'
        }}
        transitionAppear
        transitionLeave
    />);

export default Notifications;