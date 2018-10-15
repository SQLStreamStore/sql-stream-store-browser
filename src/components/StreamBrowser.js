import React from 'react';
import { List, ListItem, Typography, withStyles } from '@material-ui/core';
import Hyperlink from './Hyperlink';

const StreamBrowser = withStyles(theme => ({
    popover: {
        padding: theme.spacing.unit * 2.5,
    },
}))(({ streams, onNavigate, classes }) => (
    <div className={classes.popover}>
        <Typography variant={'title'}>Stream Browser</Typography>
        {streams.length ? (
            <List>
                {streams.map(({ title, href }) => (
                    <ListItem button key={href}>
                        <Hyperlink href={href} onNavigate={onNavigate}>
                            <span>{title}</span>
                        </Hyperlink>
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
