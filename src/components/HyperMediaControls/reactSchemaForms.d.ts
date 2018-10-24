import { FormEventHandler } from 'react';

interface Form {
    description: string;
    htmlClass: string;
    key: string;
    placeholder: string;
    readonly: boolean;
    title: string;
    type: string;
}

export interface FormInputProps {
    error: string;
    form: Form;
    onChangeValidate: FormEventHandler;
    model: { [key: string]: any };
    onChange: (key: string, value: string) => void;
    setDefault: (
        key: string,
        model: { [key: string]: any },
        form: Form,
        value: string,
    ) => void;
    value: string;
}
