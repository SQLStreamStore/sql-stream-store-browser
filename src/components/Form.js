import React from 'react';

const onSubmit = e => e.preventDefault();

const Form = ({ children }) => (
    <form onSubmit={onSubmit}>
        {children}
    </form>);

export default Form;
