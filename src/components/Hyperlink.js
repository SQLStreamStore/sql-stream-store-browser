import React from 'react';
import { withStyles } from '@material-ui/core';
import { preventDefault } from '../utils';
import { withNavigation } from './NavigationProvider';
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
const Hyperlink = withNavigation()(
    withStyles(styles)(
        ({ classes, link, children, authorization, onNavigate }) => (
            <a
                href={link.href}
                className={classes.hyperlink}
                onClick={preventDefault(() => onNavigate(link, authorization))}
            >
                {children}
            </a>
        ),
    ),
);

export default Hyperlink;
