import React from 'react';
import { TextField as _TextField } from '@material-ui/core';

const getType = type => (type !== 'text' || type === 'textarea')
    ? undefined
    : type;

const TextField = ({
    floatingLabelText,
    hintText,
    error,
    errorText,
    multiLine,
    type,
    ...props
}) => (
    <_TextField
        {...props}
        type={getType(type)}
        helperText={error ? errorText : hintText}
        label={floatingLabelText}
        multiline={multiLine}
        fullWidth
    />
);

export default TextField;