import { LinearProgress, Modal } from '@material-ui/core';
import React from 'react';

const Loading = ({ open }: { open: boolean }) => (
    <div>
        <LinearProgress
            variant={open ? 'indeterminate' : 'determinate'}
            value={open ? undefined : 0}
        />
        <Modal disableBackdropClick disableEscapeKeyDown open={open}>
            <span />
        </Modal>
    </div>
);
export default Loading;
