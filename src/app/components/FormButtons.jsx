import React, { PureComponent } from 'react';
import {
    Card,
    CardActions,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Slide,
    withStyles
} from '@material-ui/core';
import { SchemaForm } from 'react-schema-form';

import RelIcon from './RelIcon.jsx';
import UuidField from './UuidField.jsx';
import { rels, actions } from '../stream-store';
import { createState, connect } from '../reactive';

const url$ = actions.getResponse.map(({ url }) => () => url);

const state$ = createState(
    url$.map(url => ['url', url])
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

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    }
})

const SlideUp = props => (
    <Slide
        direction="up"
        {...props}
    />
);

const mapper = {
    'uuid': UuidField
};

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

        const { rel, url, actions } = this.props;
        const { model: body } = this.state;

        actions[rel] && actions[rel].next({
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
        const { rel, title, schema, classes } = this.props;
        const { open, model } = this.state;
        return (
            <span>
                <Button 
                    variant='contained'
                    color='secondary'
                    label={title}
                    onClick={this._onOpen}
                    className={classes.button}
                >
                    <RelIcon rel={rel} />
                    {schema.title}
                </Button>
                <Dialog
                    open={open}
                    TransitionComponent={SlideUp}
                    disableBackdropClick={false}
                >
                    <DialogTitle>{schema.title}</DialogTitle>
                    <DialogContent>
                        <SchemaForm 
                            schema={schema}
                            model={model}
                            mapper={mapper}
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
            </span>
        );
    }
}

FormButton = withStyles(styles)(FormButton);

const FormButtons = ({ forms, url, actions }) => (
    <Card>
        <CardActions>
            {Object.keys(forms).map(rel => (
                <FormButton
                    key={rel}
                    rel={rel}
                    url={url}
                    actions={actions}
                    schema={forms[rel]}
                />))}
        </CardActions>
    </Card>);

export default connect(state$)(FormButtons);