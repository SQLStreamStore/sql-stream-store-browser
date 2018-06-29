import React from 'react';
import PropTypes from 'prop-types';
import { 
    IconButton
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { rels } from '../stream-store';
import { preventDefault } from '../utils';

const fontIconByRel =  {
    [rels.first]: <Icons.FirstPage />,
    [rels.previous]: <Icons.ChevronLeft />,
    [rels.self]: <Icons.Refresh />,
    [rels.next]: <Icons.ChevronRight />,
    [rels.last]: <Icons.LastPage />,
    [rels.metadata]: <Icons.Settings />,
    [rels.feed]: <Icons.RssFeed />
};

const NavigationLink = ({ disabled, onClick, rel }) => (
    <IconButton 
        variant='Raised'
        disabled={disabled} 
        onClick={onClick} 
    >
        {fontIconByRel[rel]}
    </IconButton>);

const NavigationLinks = ({ onNavigate, links }) => (
    <nav>
        {Object.keys(fontIconByRel).map(rel => (
            <NavigationLink 
                disabled={!links[rel]} 
                key={rel} 
                onClick={preventDefault(() => onNavigate(links[rel].href))} 
                link={links[rel]} 
                rel={rel} 
            />))}
    </nav>);

NavigationLinks.propTypes = {
    onNavigate: PropTypes.func.isRequired
};

export default NavigationLinks;