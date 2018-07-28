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
import { withAuthorization } from './AuthorizationProvider';
import RelIcon from './RelIcon';
import UuidField from './UuidField';
import { createState, connect } from '../reactive';
import { navigation, store } from '../stream-store';
import { preventDefault } from '../utils';

const state$ = createState(store.url$.map(url => ['url', () => url]));

const getValue = value => {
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

const SlideUp = props => <Slide direction={'up'} {...props} />;

const mapper = {
    uuid: UuidField,
};

const HyperMediaPopup = withStyles(styles)(
    class HyperMediaPopup extends PureComponent {
        state = {
            open: false,
        };

        _onOpen = () =>
            this.setState({
                open: true,
            });

        _onClose = () =>
            this.setState({
                open: false,
            });

        _onSubmit = e => {
            const { onSubmit } = this.props;
            e.preventDefault();

            onSubmit();

            this._onClose();
        };

        render() {
            const {
                label,
                rel,
                title,
                classes,
                children,
                onSubmit,
            } = this.props;
            const { open } = this.state;
            return (
                <span>
                    <Button
                        label={label}
                        onClick={this._onOpen}
                        className={classes.button}
                    >
                        <RelIcon rel={rel} />
                        {title}
                    </Button>
                    <Dialog
                        open={open}
                        TransitionComponent={SlideUp}
                        disableBackdropClick={false}
                    >
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <Button color={'primary'} onClick={this._onClose}>
                                {'Cancel'}
                            </Button>
                            <Button color={'primary'} onClick={onSubmit}>
                                {'Submit'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </span>
            );
        }
    },
);

const NonTemplatedLinkButton = withAuthorization(
    withStyles(styles)(({ link, rel, authorization, onNavigate }) => (
        <Button
            variant={'text'}
            onClick={preventDefault(() => onNavigate(link.href, authorization))}
        >
            <RelIcon rel={rel} />
            {rel}
        </Button>
    )),
);

const LinkButton = ({ link, ...props }) =>
    link.templated === true ? null : <NonTemplatedLinkButton {...props} />;

const FormButton = withAuthorization(
    class FormButton extends PureComponent {
        state = {};
        _onSubmit = () => {
            const { rel, url, actions, authorization } = this.props;
            const { model: body } = this.state;

            if (actions[rel]) {
                actions[rel].next({
                    body,
                    url,
                    headers: {
                        authorization,
                    },
                });
            }
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
            const { schema, rel, title } = this.props;
            const { model } = this.state;
            return (
                <HyperMediaPopup
                    labe={title}
                    rel={rel}
                    title={schema.title}
                    onSubmit={this._onSubmit}
                >
                    <SchemaForm
                        schema={schema}
                        model={model}
                        mapper={mapper}
                        onModelChange={this._onModelChange}
                    />
                </HyperMediaPopup>
            );
        }
    },
);

const FormButtons = ({ forms, url, actions, links, onNavigate }) => (
    <Card>
        <CardActions>
            <div>
                {Object.keys(links)
                    .filter(rel => !navigation.has(rel))
                    .map(rel => (
                        <LinkButton
                            key={rel}
                            rel={rel}
                            url={url}
                            link={links[rel]}
                            onNavigate={onNavigate}
                        >
                            {rel}
                        </LinkButton>
                    ))}
            </div>
            <div>
                {Object.keys(forms).map(rel => (
                    <FormButton
                        key={rel}
                        rel={rel}
                        url={url}
                        actions={actions}
                        schema={forms[rel]}
                    />
                ))}
            </div>
        </CardActions>
    </Card>
);

export default connect(state$)(FormButtons);
