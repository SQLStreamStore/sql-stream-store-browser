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
import { createState, connect } from '../reactive';

const fontIconByRel =  {
    [rels.append]: <Icons.Publish />
};

const actionsByRel = {
    [rels.append]: actions.post
};

const url$ = actions.getResponse.map(({ url }) => () => url);

const state$ = createState(
    url$.map(url => ['url', url])
);

const SlideUp = props => (
    <Slide
        direction="up"
        {...props}
    />
);

const getValue = value => {
    if (typeof value === "object") {
        try {
            return JSON.parse(value.target.value);
        }
        catch(e) {
            return value.target.value;
        }
    }

    return value;
}

class FormButton extends PureComponent {
    state = {
        open: false
    };
    _onOpen = () => this.setState({ 
        ...this.state,
        open: true
    });
    _onClose = () => this.setState({
        ...this.state,
        open: false,
    });
    _onSubmit = e => {
        e.preventDefault();

        const { rel, url } = this.props;
        const { model: body } = this.state;

        actionsByRel[rel] && actionsByRel[rel].next({
            body,
            url
        });

        this._onClose();
    };
    _onModelChange = (key, value) => this.setState({ 
        ...this.state, 
        model: {
            ...this.state.model,
            [key]: getValue(value)
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
                    {fontIconByRel[rel] || (<Icons.SentimentNeutral />)}
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

const FormButtons = ({ forms, url }) => (
    <div>{Object.keys(forms).map(rel => (
        <FormButton
            key={rel}
            rel={rel}
            url={url}
            schema={forms[rel]}
        />))}
    </div>);

export default connect(state$)(FormButtons);