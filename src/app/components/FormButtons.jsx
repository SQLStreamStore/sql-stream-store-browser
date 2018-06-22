import React, { PureComponent } from 'react';
import { 
    FontIcon,
    RaisedButton,
    FlatButton,
    Dialog
} from 'material-ui';
import { SchemaForm } from 'react-schema-form';
import { rels, actions } from '../stream-store';

const fontIconByRel =  {
    [rels.append]: 'publish'
};

const actionsByRel = {
    [rels.append]: actions.post
};

let url;

actions.getResponse.subscribe(({ url: _url }) => url = _url);

class FormButton extends PureComponent {
    state = {
        open: false
    };
    _onOpen = () => this.setState({ 
        ...this.state,
        open: true
    });
    _onClose = () => this.setState({
        open: false,
        ...this.state
    });
    _onSubmit = e => {
        e.preventDefault();

        const { rel } = this.props;
        const { model: body } = this.state;

        actionsByRel[rel].next({
            body,
            url
        });

        this._onClose();
    };
    _onModelChange = (key, value) => this.setState({ 
        ...this.state, 
        model: {
            ...this.state.model,
            [key]: value
        } 
    });
    
    render() {
        const { rel, title, schema } = this.props;
        const { open, model } = this.state;
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
                            onClick={this._onSubmit}
                        />
                    ]}
                >
                <SchemaForm 
                    schema={schema}
                    model={model}
                    onModelChange={this._onModelChange}
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