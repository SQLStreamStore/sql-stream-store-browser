import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon, RaisedButton } from 'material-ui';

const rels = ['first', 'previous', 'self', 'next', 'last'];

const fontIconByRel =  {
    'next': 'chevron_right',
    'previous': 'chevron_left',
    'self': 'refresh',
    'first': 'first_page',
    'last': 'last_page'
};

const NavigationLink = ({ disabled, onClick, link, rel }) => (
    <RaisedButton 
        disabled={disabled} 
        onClick={onClick} 
        icon={<FontIcon className='material-icons'>{fontIconByRel[rel]}</FontIcon>}
    />);

const NavigationLinks = ({ onNavigate, links }) => (
    <nav>
        {rels.map(rel => (
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