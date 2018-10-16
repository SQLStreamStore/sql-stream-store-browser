import React from 'react';
import { LinearProgress, Modal } from '@material-ui/core';

const variants = {
    true: 'indeterminate',
    false: 'determinate',
};

const values = {
    true: undefined,
    false: 0,
};

const Loading = ({ open }) => (
    <div>
        <LinearProgress variant={variants[open]} value={values[open]} />
        <Modal disableBackdropClick disableEscapeKeyDown open={open}>
            <span />
        </Modal>
    </div>
);
export default Loading;
