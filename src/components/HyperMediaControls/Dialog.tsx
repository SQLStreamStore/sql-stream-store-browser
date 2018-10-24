import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import React, {
    FormEventHandler,
    PureComponent,
    StatelessComponent,
} from 'react';

import { SlideProps } from '@material-ui/core/Slide';
import { HalLink } from '../../types';
import RelIcon from '../RelIcon';
import HelpButton from './HelpButton';
import RelButton from './RelButton';
const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const SlideUp: StatelessComponent<SlideProps> = props => (
    <Slide direction={'up'} {...props} />
);

const isStandardRel = (rel: string) => rel.indexOf(':') === -1;

interface HyperMediaDialogProps {
    rel: string;
    title?: string;
    curies: HalLink[];
    onSubmit: () => void;
}

export default withStyles(styles)(
    class HyperMediaDialog extends PureComponent<
        HyperMediaDialogProps & WithStyles<typeof styles>,
        { open: boolean }
    > {
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
            const { rel, title, classes, children, curies } = this.props;
            const { open } = this.state;

            return (
                <span>
                    <RelButton
                        onClick={this._onOpen}
                        className={classes.button}
                        rel={rel}
                        title={title}
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
                            {!isStandardRel(rel) && (
                                <HelpButton rel={rel} curies={curies} />
                            )}
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
