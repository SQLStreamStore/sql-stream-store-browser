import React, { PureComponent } from 'react';
import {
    Button, 
    TextField
} from '@material-ui/core';
import {
    SpaceBar
} from '@material-ui/icons'
import uuid from 'uuid';
import { ComposedComponent } from 'react-schema-form';

class UuidField extends React.PureComponent {
    _onNewUuidClick = () => this.props.onChange(this.props.form.key, uuid.v4());

    render() {
        return (
            <div className={this.props.form.htmlClass}>
                <TextField                    
                    type={this.props.form.type}
                    label={this.props.form.title}
                    error={this.props.error || this.props.errorText}
                    onChange={this.props.onChangeValidate}
                    defaultValue={this.props.value}
                    disabled={this.props.form.readonly}
                    helperText={this.props.error ? this.props.errorText : this.props.hintText}
                    style={this.props.form.style || {width: '100%'}}
                />
                <Button
                    color='primary'
                    variant={'contained'}
                    onClick={this._onNewUuidClick}
                >
                    New UUID
                    <SpaceBar />
                </Button>
            </div>);
    }
}

export default ComposedComponent['default'](UuidField);