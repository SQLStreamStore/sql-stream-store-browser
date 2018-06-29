import React from 'react';
import { TextField as _TextField } from '@material-ui/core';

const TextField = ({
    floatingLabelText,
    hintText,
    error,
    errorText,
    multiLine,
    ...props
}) => (
    <_TextField
        {...props}
        helperText={error ? errorText: hintText}
        label={floatingLabelText}
        multiline={multiLine}
    />
);

export default TextField;