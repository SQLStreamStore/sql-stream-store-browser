import React, { PureComponent } from 'react';
import { 
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Slide
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { SchemaForm } from 'react-schema-form';
import { rels, actions } from '../stream-store';

const fontIconByRel =  {
    [rels.append]: <Icons.Publish />
};

const actionsByRel = {
    [rels.append]: actions.post
};

let url;

actions.getResponse.subscribe(({ url: _url }) => url = _url);

const SlideUp = props => (
    <Slide
        direction="up"
        {...props} />
);

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
                <Button 
                    variant='raised'
                    label={title}
                    onClick={this._onOpen}
                >
                    {fontIconByRel[rel]}
                </Button>
                <Dialog
                    title={title}
                    open={open}
                    TransitionComponent={SlideUp}
                    disableBackdropClick={false}
                >
                    <DialogContent>
                        <SchemaForm 
                            schema={schema}
                            model={model}
                            onModelChange={this._onModelChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color='primary'
                            onClick={this._onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color='primary'
                            onClick={this._onSubmit}
                        >
                            Submit
                        </Button>
                    </DialogActions>
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