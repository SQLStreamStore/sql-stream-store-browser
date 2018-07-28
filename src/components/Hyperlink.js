import React from 'react';
import { withStyles } from '@material-ui/core';
import { preventDefault } from '../utils';
import { withAuthorization } from './AuthorizationProvider';
import theme from '../theme';

const color = theme.palette.action.active;

const styles = {
    hyperlink: {
        color,
        '&:hover': {
            color,
        },
        '&:active': {
            color,
        },
        '&:visited': {
            color,
        },
    },
};
const Hyperlink = withAuthorization()(
    withStyles(styles)(
        ({ classes, href, children, authorization, onNavigate }) => (
            <a
                href={href}
                className={classes.hyperlink}
                onClick={preventDefault(() => onNavigate(href, authorization))}
            >
                {children}
            </a>
        ),
    ),
);

export default Hyperlink;
