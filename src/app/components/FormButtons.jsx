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
    withStyles
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { SchemaForm } from 'react-schema-form';
import { rels, actions } from '../stream-store';
import { createState, connect } from '../reactive';

const fontIconByRel =  {
    [rels.append]: <Icons.Publish />,
    [rels.metadata]: <Icons.Layers />,
    [rels.delete]: <Icons.DeleteForever />
};

const actionsByRel = {
    [rels.append]: actions.post,
    [rels.metadata]: actions.post,
    [rels.delete]: actions.delete
};

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
                    {fontIconByRel[rel] || (<Icons.SentimentNeutral />)}
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

const FormButtons = ({ forms, url }) => (
    <Card>
        <CardActions>
            {Object.keys(forms).map(rel => (
                <FormButton
                    key={rel}
                    rel={rel}
                    url={url}
                    schema={forms[rel]}
                />))}
        </CardActions>
    </Card>);

export default connect(state$)(FormButtons);