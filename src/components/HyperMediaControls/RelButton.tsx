import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React, { FunctionComponent } from 'react';
import RelIcon from './../../components/RelIcon';

interface RelButtonProps {
    rel: string;
    title?: string;
}

const RelButton: FunctionComponent<RelButtonProps & ButtonProps> = ({
    rel,
    onClick,
    title,
    ...props
}) => (
    <Button variant={'text'} onClick={onClick} {...props}>
        <RelIcon rel={rel} color={'action'} />
        {title || rel}
    </Button>
);

export default RelButton;
