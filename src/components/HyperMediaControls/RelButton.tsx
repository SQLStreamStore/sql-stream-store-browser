import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import React, { ReactNode, StatelessComponent } from 'react';
import RelIcon from '../RelIcon';

interface RelButtonProps {
    rel: string;
    title?: string;
}

const RelButton: StatelessComponent<RelButtonProps & ButtonProps> = ({
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
