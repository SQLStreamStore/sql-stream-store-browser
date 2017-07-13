import React from 'react';

const Form = ({ children }) => (
    <form onSubmit={e => e.preventDefault()}>
        {children}
    </form>);

export default Form;