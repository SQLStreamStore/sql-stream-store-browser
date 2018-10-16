import React, { PureComponent } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Slide,
    withStyles,
} from '@material-ui/core';

import RelIcon from '../RelIcon';
import RelButton from './RelButton';
const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const SlideUp = props => <Slide direction={'up'} {...props} />;

export default withStyles(styles)(
    class HyperMediaDialog extends PureComponent {
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
            const { label, rel, title, classes, children } = this.props;
            const { open } = this.state;

            return (
                <span>
                    <RelButton
                        label={label}
                        onClick={this._onOpen}
                        className={classes.button}
                        rel={rel}
                        title={title}
                        color={'action'}
                    />
                    <Dialog
                        open={open}
                        TransitionComponent={SlideUp}
                        disableBackdropClick={false}
                        fullWidth
                        onEscapeKeyDown={this._onClose}
                    >
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>{children}</DialogContent>
                        <DialogActions>
                            <Button onClick={this._onClose}>{'Cancel'}</Button>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                onClick={this._onSubmit}
                            >
                                <RelIcon rel={rel} color={'inherit'} />
                                {'Submit'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </span>
            );
        }
    },
);
