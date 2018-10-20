import React from 'react';
import { IconButton } from '@material-ui/core';
import RelIcon from './RelIcon';
import { withAuthorization } from './AuthorizationProvider';
import { navigation } from '../stream-store';
import { preventDefault } from '../utils';

const FeedNavigationLink = ({ disabled, onClick, rel }) => (
    <IconButton
        variant={disabled ? 'disabled' : 'raised'}
        disabled={disabled}
        onClick={onClick}
    >
        <RelIcon rel={rel} />
    </IconButton>
);

const NavigationLinks = ({ onNavigate, links, authorization }) => (
    <nav>
        {[...navigation].map(rel => (
            <FeedNavigationLink
                disabled={!links[rel]}
                key={rel}
                onClick={preventDefault(() =>
                    onNavigate(links[rel], authorization),
                )}
                link={links[rel]}
                rel={rel}
            />
        ))}
    </nav>
);

export default withAuthorization()(NavigationLinks);
