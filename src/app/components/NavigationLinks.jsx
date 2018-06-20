import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon, RaisedButton } from 'material-ui';
import { rels } from '../stream-store';
import { preventDefault } from '../utils';

const fontIconByRel =  {
    [rels.first]: 'first_page',
    [rels.previous]: 'chevron_left',
    [rels.self]: 'refresh',
    [rels.next]: 'chevron_right',
    [rels.last]: 'last_page',
    [rels.metadata]: 'settings',
    [rels.feed]: 'rss_feed'
};

const NavigationLink = ({ disabled, onClick, link, rel }) => (
    <RaisedButton 
        disabled={disabled} 
        onClick={onClick} 
        icon={<FontIcon className='material-icons'>{fontIconByRel[rel]}</FontIcon>}
    />);

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