import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import RelIcon from './RelIcon.jsx';
import { rels } from '../stream-store';
import { preventDefault } from '../utils';

const navigationRels = [
    'first',
    'previous',
    'self',
    'next',
    'last',
    'metadata',
    'feed'
].map(rel => rels[rel]);

const NavigationLink = ({ disabled, onClick, rel }) => (
    <IconButton 
        variant='Raised'
        disabled={disabled} 
        onClick={onClick} 
    >
        <RelIcon rel={rel} />
    </IconButton>);

const NavigationLinks = ({ onNavigate, links }) => (
    <nav>
        {navigationRels.map(rel => (
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