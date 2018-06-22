import React, { PureComponent } from 'react';
import { 
    FontIcon,
    RaisedButton,
    FlatButton,
    Dialog,
    TextField
} from 'material-ui';
import { SchemaForm } from 'react-schema-form';
import { rels } from '../stream-store';

const fontIconByRel =  {
    [rels.append]: 'publish'
};

const mapSchemaToForm = ({ properties }) => Object.keys(properties)
    .map(key => ({ name: key, type: properties[key].type }));

const Json = ({ form }) => (
    <div className={form.htmlClass}>
        <TextField
            type={form.type}
            floatingLabelText={form.title}
            hintText={form.placeholder}
            onChange={onChangeValidate}
            errorText={props.error || props.errorText}
            defaultValue={props.value}
            multiLine
            rows={form.rows}
            rowsMax={form.rowsMax}
            disabled={form.readonly}
            style={form.style || {width: '100%'}}
        />
    </div>);

class Form extends PureComponent {
    state = {}
    
    _onModelChange = (key, value) => this.setState({ ...this.state, [key]: value });
    
    render() {
        const { schema } = this.props;
        return (
            <SchemaForm 
                schema={schema}
                model={this.state}
                onModelChange={this._onModelChange}
            />);
    }
}

class FormButton extends PureComponent {
    state = {
        open: false
    };
    _onOpen = () => this.setState({ open: true });
    _onClose = () => this.setState({ open: false });

    render() {
        const { rel, title, schema } = this.props;
        const { open } = this.state;
        return (
            <div>
                <RaisedButton 
                    label={title}
                    icon={<FontIcon className='material-icons'>{fontIconByRel[rel]}</FontIcon>}
                    onClick={this._onOpen}
                />
                <Dialog
                    title={title}
                    modal
                    open={open}
                    autoScrollBodyContent
                    actions={[
                        <FlatButton
                            label="Cancel"
                            primary
                            onClick={this._onClose}
                        />,
                        <FlatButton
                            label="Submit"
                            primary
                            onClick={this._onClose}
                        />
                    ]}
                >
                    <Form
                        schema={schema} 
                    />
                </Dialog>
            </div>
        );
    }
}

const FormButtons = ({ forms }) => (
    <div>{Object.keys(forms).map(rel => (
        <FormButton
            key={rel}
            rel={rel}
            schema={forms[rel]}
        />))}
    </div>);

export default FormButtons;