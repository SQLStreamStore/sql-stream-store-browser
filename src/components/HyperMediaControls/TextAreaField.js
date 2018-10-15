import React from 'react';
import { TextField } from '@material-ui/core';
import { ComposedComponent } from 'react-schema-form';

const TextAreaField = ({ form, error, onChangeValidate, value }) => (
    <div className={form.htmlClass}>
        <TextField
            type={form.type}
            label={form.title}
            placeholder={form.placeholder}
            helperText={error || form.description}
            error={!!error}
            onChange={onChangeValidate}
            value={value}
            disabled={form.readonly}
            fullWidth
            multiline
            rows={15}
            rowsMax={15}
        />
    </div>
);

export default ComposedComponent.default(TextAreaField);
