import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Typography,
    withStyles,
} from '@material-ui/core';
import Hyperlink from './Hyperlink';

const StreamBrowser = withStyles(theme => ({
    browser: {
        padding: theme.spacing.unit * 2.5,
    },
}))(({ streams, classes, loading }) => (
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
));

export default StreamBrowser;
