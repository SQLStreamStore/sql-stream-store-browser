import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { SpaceBar } from '@material-ui/icons';
import uuid from 'uuid';
import { ComposedComponent } from 'react-schema-form';

class UuidField extends React.PureComponent {
    _onNewUuidClick = () => {
        const { form, onChange } = this.props;
        onChange(form.key, uuid.v4());
    };

    render() {
        const {
            form,
            error,
            onChangeValidate,
            errorText,
            hintText,
            value,
        } = this.props;
        return (
            <div className={form.htmlClass}>
                <TextField
                    type={form.type}
                    label={form.title}
                    error={error || errorText}
                    onChange={onChangeValidate}
                    defaultValue={value}
                    disabled={form.readonly}
                    helperText={error ? errorText : hintText}
                    style={form.style || { width: '100%' }}
                />
                <Button
                    color={'primary'}
                    variant={'contained'}
                    onClick={this._onNewUuidClick}
                >
                    New UUID
                    <SpaceBar />
                </Button>
            </div>
        );
    }
}

export default ComposedComponent.default(UuidField);
