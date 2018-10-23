import React, { PureComponent } from 'react';
import { IconButton } from '@material-ui/core';
import RelIcon from './RelIcon';
import { withNavigation } from './NavigationProvider';
import { navigation } from '../stream-store';

const FeedNavigationLink = withNavigation()(
    class What extends PureComponent {
        _handleOnClick = e => {
            const { onNavigate, authorization, link } = this.props;

            e.preventDefault();

            if (!link) {
                return;
            }

            return onNavigate(link, authorization);
        };

        render() {
            const { rel, link } = this.props;
            return (
                <IconButton
                    variant={!link ? 'disabled' : 'raised'}
                    disabled={!link}
                    onClick={this._handleOnClick}
                >
                    <RelIcon rel={rel} />
                </IconButton>
            );
        }
    },
);

const NavigationLinks = ({ links }) => (
    <nav>
        {[...navigation].map(rel => (
            <FeedNavigationLink
                key={rel}
                link={(links[rel] || [])[0]}
                rel={rel}
            />
        ))}
    </nav>
);

export default NavigationLinks;
