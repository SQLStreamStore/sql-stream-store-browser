import React, { PureComponent } from 'react';
import {
    Button, 
    TextField
} from '@material-ui/core';
import uuid from 'uuid';
import { ComposedComponent } from 'react-schema-form';

class UuidField extends React.PureComponent {
    constructor(props) {
        super(props);

        const { model, form, value, classes } = this.props;
        const { key } = form;
    }

    _onNewUuidClick = e => this.props.onChangeValidate({
        ...e,
        target: {
            ...e.target,
            value: uuid.v4()
        }
    });

    render() {
        return (
            <div className={this.props.form.htmlClass}>
                <TextField
                    type={this.props.form.type}
                    label={this.props.form.title}
                    error={this.props.error || this.props.errorText}
                    onChange={this.props.onChangeValidate}
                    defaultValue={this.props.value}
                    value={this.props.value}
                    disabled={this.props.form.readonly}
                    helperText={this.props.error ? this.props.errorText : this.props.hintText}
                    style={this.props.form.style || {width: '100%'}}
                />
                <Button
                    onClick={this._onNewUuidClick}
                />
            </div>);
    }
}

export default ComposedComponent['default'](UuidField);