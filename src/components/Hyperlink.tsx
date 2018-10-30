import { WithStyles, withStyles } from '@material-ui/core';
import React, { ComponentType } from 'react';
import theme from '../theme';
import { HalLink, HalLinks, NavigatableProps } from '../types';
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
    rel: string;
    multi?: boolean;
    _links: HalLinks;
}

const getLink = (links: HalLinks, rel: string): HalLink | null =>
    !links[rel] ? null : links[rel][0];

const Hyperlink: ComponentType<HyperlinkProps> = withNavigation<
    HyperlinkProps
>()(
    withStyles(styles)(
        ({
            classes,
            _links,
            authorization,
            onNavigate,
            rel,
        }: HyperlinkProps & NavigatableProps & WithStyles<typeof styles>) => {
            const link = getLink(_links, rel);
            if (!link) {
                // tslint:disable-next-line:no-console
                console.warn(`Could not find link for rel ${rel}`, _links);
                return null;
            }
            return (
                <a
                    href={link.href}
                    className={classes.hyperlink}
                    onClick={preventDefault(() =>
                        onNavigate(link, authorization),
                    )}
                >
                    {link.title}
                </a>
            );
        },
    ),
);

export default Hyperlink;
