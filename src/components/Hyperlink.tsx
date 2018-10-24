import { WithStyles, withStyles } from '@material-ui/core';
import React, { ReactNode, StatelessComponent } from 'react';
import theme from '../theme';
import { HalLink, NavigatableProps } from '../types';
import { preventDefault } from '../utils';
import { withNavigation } from './NavigationProvider';

const color = theme.palette.action.active;

const styles = {
    hyperlink: {
        '&:active': {
            color,
        },
        '&:hover': {
            color,
        },
        '&:visited': {
            color,
        },
        color,
    },
};

interface HyperlinkProps {
    link: HalLink;
}

const Hyperlink: StatelessComponent<
    HyperlinkProps & { children?: ReactNode }
> = withNavigation()(
    withStyles(styles)(
        ({
            classes,
            link,
            children,
            authorization,
            onNavigate,
        }: HyperlinkProps & { children?: ReactNode } & NavigatableProps &
            WithStyles<typeof styles>) => (
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
