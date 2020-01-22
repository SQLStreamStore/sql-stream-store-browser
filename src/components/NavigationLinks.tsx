import { IconButton } from '@material-ui/core';
import React, {
    ComponentType,
    FormEventHandler,
    FunctionComponent,
    PureComponent,
} from 'react';
import { navigation } from './../stream-store';
import { HalLink, HalLinks, NavigatableProps } from './../types';
import { withNavigation } from './NavigationProvider';
import RelIcon from './RelIcon';

interface FeedNavigationLinkProps {
    link: HalLink;
    rel: string;
}

const FeedNavigationLink: ComponentType<
    FeedNavigationLinkProps
> = withNavigation<FeedNavigationLinkProps>()(
    class extends PureComponent<FeedNavigationLinkProps & NavigatableProps> {
        _handleOnClick: FormEventHandler = e => {
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
                <IconButton disabled={!link} onClick={this._handleOnClick}>
                    <RelIcon rel={rel} />
                </IconButton>
            );
        }
    },
);
interface NavigationLinksProps {
    _links: HalLinks;
}

const NavigationLinks: FunctionComponent<NavigationLinksProps> = ({
    _links,
}) => (
    <nav>
        {[...navigation].map(rel => (
            <FeedNavigationLink
                key={rel}
                link={(_links[rel] || [])[0]}
                rel={rel}
            />
        ))}
    </nav>
);

export default NavigationLinks;
