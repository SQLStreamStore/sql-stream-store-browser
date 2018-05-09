import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon, RaisedButton } from 'material-ui';
import { rels } from '../stream-store';

const fontIconByRel =  {
    [rels.next]: 'chevron_right',
    [rels.previous]: 'chevron_left',
    [rels.self]: 'refresh',
    [rels.first]: 'first_page',
    [rels.last]: 'last_page'
};

const NavigationLink = ({ disabled, onClick, link, rel }) => (
    <RaisedButton 
        disabled={disabled} 
        onClick={onClick} 
        icon={<FontIcon className='material-icons'>{fontIconByRel[rel]}</FontIcon>}
    />);

const NavigationLinks = ({ onNavigate, links }) => (
    <nav>
        {Object.keys(rels).map(rel => rels[rel]).map(rel => (
            <NavigationLink 
                disabled={!links[rel]} 
                key={rel} 
                onClick={() => onNavigate(links[rel].href)} 
                link={links[rel]} 
                rel={rel} 
            />))}
    </nav>);

NavigationLinks.propTypes = {
    onNavigate: PropTypes.func.isRequired
};

export default NavigationLinks;