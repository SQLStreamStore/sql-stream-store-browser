import React from 'react';
import { TextField } from '@material-ui/core';

const DatePicker = ({ type = 'date', props }) => (
    <TextField
        {...props}
        type={type}
    />);

export default DatePicker;
