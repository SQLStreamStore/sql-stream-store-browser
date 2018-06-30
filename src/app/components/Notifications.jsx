import React, { createElement } from 'react';
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
    infoAvatar: {
      backgroundColor: green[500]
    },
    warningAvatar: {
      backgroundColor: yellow[500]
    },
    errorAvatar: {
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

const formatTitle = ({ status, statusText }) => `${status} ${statusText}`;

const formatSubheader = ({ title, type }) => title ? `${title} (${type})` : null;

const formatContent = ({ detail }) => detail
    ? detail
        .split(/\r|\n/)
        .filter(x => x.length)
        .reduce((akk, line, index) => ([
            ...akk,
            (<br key={index*2} />),
            (<span key={(index*2) + 1}>{line}</span>)
        ]), [])
    : null;

const responses$ = obs.merge(
    actions.getResponse,
    actions.postResponse,
    actions.deleteResponse
);

const clientError$ = responses$
    .filter(({ status }) => status >= 400 && status < 500)
    .map(({ body, ...response }) => ({
        variant: 'warning',
        title: formatTitle(response),
        subheader: formatSubheader(body),
        content: formatContent(body)
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
    .filter(({ status }) => status < 400 )
    .map(response => ({
        variant: 'info',
        title: formatTitle(response),
        timeout: 2000
    }));

const getIcon = variant => Icons[variant[0].toUpperCase() + variant.substring(1)];

const NotificationAvatar = withStyles(styles)(({ classes, variant }) => (
    <Avatar className={classes[`${variant}Avatar`]}>
        {createElement(getIcon(variant))}
    </Avatar>
));

const notification$ = obs.merge(
    clientError$,
    serverError$,
    success$
).map(({
    variant,
    ...props
}) => ({
    ...props,
    avatar: (<NotificationAvatar variant={variant} />)
}));

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