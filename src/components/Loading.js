import React from 'react';
import { CircularProgress, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
const centered = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: 0,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing.unit * 4,
        textAlign: 'center',
    },
});
const Loading = ({ open, classes }) => (
    <Modal disableBackdropClick disableEscapeKeyDown open={open}>
        <div style={centered} className={classes.paper}>
            <CircularProgress />
        </div>
    </Modal>
);

export default withStyles(styles)(Loading);
