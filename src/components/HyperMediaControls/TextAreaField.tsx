import { TextField } from '@material-ui/core';
import React, { FormEventHandler, StatelessComponent } from 'react';
import { ComposedComponent } from 'react-schema-form';

interface TextAreaFieldProps {
    error: string;
    form: {
        description: string;
        htmlClass: string;
        placeholder: string;
        readonly: boolean;
        title: string;
        type: string;
    };
    onChangeValidate: FormEventHandler;
    value: string;
}

const TextAreaField: StatelessComponent<TextAreaFieldProps> = ({
    form,
    error,
    onChangeValidate,
    value,
}) => (
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
