declare module 'react-schema-form' {
    import { JSONSchema7 } from 'json-schema';
    import { ComponentType, FormEventHandler } from 'react';

    interface Form {
        description: string;
        htmlClass: string;
        key: string;
        placeholder: string;
        readonly: boolean;
        title: string;
        type: string;
    }

    export interface ReactSchemaFormInputProps {
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

    interface ReactSchemaFormProps {
        className?: string;
        model: object;
        schema: JSONSchema7;
        mapper: { [key: string]: ComponentType };
        onModelChange(
            key: string,
            value: any,
            type: string,
            form: JSONSchema7,
        ): void;
    }

    export const SchemaForm: ComponentType<ReactSchemaFormProps>;

    export const ComposedComponent: <T>(
        component: ComponentType<T>,
    ) => ComponentType<ReactSchemaFormInputProps>;
}
