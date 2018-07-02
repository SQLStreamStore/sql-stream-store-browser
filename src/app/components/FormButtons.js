import React, { PureComponent } from 'react';
import {
    Card,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Slide,
    withStyles,
} from '@material-ui/core';
import { SchemaForm } from 'react-schema-form';

import RelIcon from './RelIcon';
import UuidField from './UuidField';
import { createState, connect } from '../reactive';
import { actions as ssActions } from '../stream-store';

const url$ = ssActions.getResponse.map(({ url }) => () => url);

const state$ = createState(
    url$.map(url => ['url', url]),
);

const getValue = (value) => {
    if (typeof value === 'object') {
        try {
            return JSON.parse(value.target.value);
        } catch (e) {
            return value.target.value;
        }
    }

    return value;
};

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const SlideUp = props => (
    <Slide
        direction="up"
        {...props}
    />
);

const mapper = {
    uuid: UuidField,
};

const FormButton = withStyles(styles)(class FormButton extends PureComponent {
    state = {
        open: false,
    };

    _onOpen = () => this.setState({
        open: true,
    });

    _onClose = () => this.setState({
        open: false,
    });

    _onSubmit = (e) => {
        e.preventDefault();

        const { rel, url, actions } = this.props;
        const { model: body } = this.state;

        if (actions[rel]) {
            actions[rel].next({
                body,
                url,
            });
        }

        this._onClose();
    };

    _onModelChange = (key, value) => {
        const { model, ...state } = this.state;
        this.setState({
            ...state,
            model: {
                ...model,
                [key]: getValue(value),
            },
        });
    };

    render() {
        const {
            rel, title, schema, classes,
        } = this.props;
        const { open, model } = this.state;
        return (
            <span>
                <Button
                    variant="contained"
                    color="secondary"
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
                    <DialogTitle>
                        {schema.title}
                    </DialogTitle>
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
                            color="primary"
                            onClick={this._onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={this._onSubmit}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
});

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
