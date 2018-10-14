import React from 'react';
import { List, ListItem, Typography, withStyles } from '@material-ui/core';
import Hyperlink from './Hyperlink';

const StreamBrowser = ({ streams, onNavigate }) => (
    <div>
        <Typography variant={'title'}>Stream Browser</Typography>
        {streams.length ? (
            <List>
                {streams.map(({ title, href }) => (
                    <ListItem button key={href}>
                        <Hyperlink href={href} onNavigate={onNavigate}>
                            {title}
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
);

export default withStyles(theme => ({
    paper: {
        padding: theme.spacing.unit * 2.5,
    },
}))(StreamBrowser);
