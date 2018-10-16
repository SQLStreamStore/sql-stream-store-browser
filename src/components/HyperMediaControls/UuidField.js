import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { SpaceBar } from '../Icons';
import uuid from 'uuid';
import { ComposedComponent } from 'react-schema-form';

class UuidField extends React.PureComponent {
    constructor(props) {
        super(props);

        const { model, form, setDefault } = this.props;
        const { key } = form;
        setDefault(key, model, form, uuid.v4());
    }
    _onNewUuidClick = () => {
        const { form, onChange } = this.props;
        onChange(form.key, uuid.v4());
    };

    render() {
        const { form, error, onChangeValidate, value } = this.props;
        return (
            <div className={form.htmlClass}>
                <TextField
                    type={form.type}
                    label={form.title}
                    placeholder={form.placeholder}
                    helperText={error || form.description}
                    error={!!error}
                    onChange={onChangeValidate}
                    value={value || ''}
                    disabled={form.readonly}
                    fullWidth
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
