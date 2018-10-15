import React from 'react';
import { LinearProgress, Modal } from '@material-ui/core';

const Loading = ({ open }) =>
    open ? (
        <div>
            <LinearProgress variant={'indeterminate'} />
            <Modal disableBackdropClick disableEscapeKeyDown open>
                <span />
            </Modal>
        </div>
    ) : null;

export default Loading;
