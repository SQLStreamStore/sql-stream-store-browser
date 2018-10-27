import { FormEventHandler } from 'react';

const preventDefault = (cb: () => void): FormEventHandler => e => {
    e.preventDefault();
    cb();
};

export default preventDefault;
