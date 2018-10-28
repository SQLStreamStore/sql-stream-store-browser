import {
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import React, { ComponentType } from 'react';
import { HalLink } from '../types';
import Hyperlink from './Hyperlink';

const styles = theme => ({
    browser: {
        padding: theme.spacing.unit * 2.5,
    },
});

interface StreamBrowserProps {
    loading: boolean;
    streams: HalLink[];
}

const StreamBrowser: ComponentType<StreamBrowserProps> = withStyles(styles)(
    ({
        streams,
        classes,
        loading,
    }: StreamBrowserProps & WithStyles<typeof styles>) => (
        <div className={classes.browser}>
            <Typography variant={'title'}>Stream Browser</Typography>
            {loading ? (
                <LinearProgress />
            ) : streams.length ? (
                <List>
                    {streams.map(link => (
                        <ListItem key={link.href}>
                            <ListItemText>
                                <Hyperlink link={link}>{link.title}</Hyperlink>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant={'body2'}>
                    No matching streams found.
                </Typography>
            )}
        </div>
    ),
);

export default StreamBrowser as ComponentType<StreamBrowserProps>;
