import React from 'react';
import { Button } from '@material-ui/core';
import RelIcon from '../RelIcon';

const RelButton = ({ rel, onClick, title, color, ...props }) => (
    <Button variant={'text'} onClick={onClick} {...props}>
        <RelIcon rel={rel} color={color} />
        {title || rel}
    </Button>
);

export default RelButton;
