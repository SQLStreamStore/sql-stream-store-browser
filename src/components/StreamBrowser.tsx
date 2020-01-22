import {
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Theme,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import React, { ComponentType } from 'react';
import { rels } from './../stream-store';
import { HalResource } from './../types';
import Hyperlink from './Hyperlink';

const styles = (theme: Theme) => ({
    browser: {
        padding: theme.spacing.unit * 2.5,
    },
});

interface StreamBrowserProps {
    loading: boolean;
    streams: HalResource[];
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
                    {streams.map(({ _links }) => (
                        <ListItem
                            key={_links[rels.self].map(({ href }) => href)[0]}
                        >
                            <ListItemText>
                                <Hyperlink _links={_links} rel={rels.feed} />
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
