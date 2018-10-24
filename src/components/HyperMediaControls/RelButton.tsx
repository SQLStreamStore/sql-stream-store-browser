import React, { StatelessComponent } from 'react';
import { Button } from '@material-ui/core';
import RelIcon from '../RelIcon';
import { ButtonProps } from '@material-ui/core/Button';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

interface RelButtonProps {
    rel: string;
    title?: string;
    color: SvgIconProps['color'];
}

const RelButton: StatelessComponent<RelButtonProps & ButtonProps> = ({
    rel,
    onClick,
    title,
    color,
    ...props
}) => (
    <Button variant={'text'} onClick={onClick} {...props}>
        <RelIcon rel={rel} color={color} />
        {title || rel}
    </Button>
);

export default RelButton;
