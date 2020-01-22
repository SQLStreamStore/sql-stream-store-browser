import { withAuthorization } from './../../components/AuthorizationProvider';
import { JSONSchema7 } from 'json-schema';
import React, { FormEvent, PureComponent } from 'react';
import { SchemaForm } from 'react-schema-form';
import { AuthorizationProps, FormActions, HalLink } from './../../types';
import Dialog from './Dialog';
import TextAreaField from './TextAreaField';
import UuidField from './UuidField';

const mapper = {
    textarea: TextAreaField,
    uuid: UuidField,
};

interface FormButtonProps {
    rel: string;
    link: HalLink;
    actions: FormActions;
    curies: HalLink[];
    schema: JSONSchema7;
}

interface FormButtonState {
    model: {
        [key: string]: any;
    };
}

class FormButton extends PureComponent<
    FormButtonProps & AuthorizationProps,
    FormButtonState
> {
    state = {
        model: {},
    };
    _onSubmit = () => {
        const { rel, link, actions, authorization } = this.props;
        const { model: body } = this.state;

        if (actions[rel]) {
            actions[rel].request.next({
                body,
                headers: {
                    authorization,
                },
                link,
            });
        }
    };

    _onModelChange = (key: string, value: FormEvent<HTMLInputElement>) => {
        const { model, ...state } = this.state;
        this.setState({
            ...state,
            model: {
                ...model,
                [key]: value,
            },
        });
    };

    render() {
        const { schema, rel, curies } = this.props;
        const { model } = this.state;
        return (
            <Dialog
                rel={rel}
                title={schema.title}
                curies={curies}
                onSubmit={this._onSubmit}
            >
                <SchemaForm
                    schema={schema}
                    model={model}
                    mapper={mapper}
                    onModelChange={this._onModelChange}
                />
            </Dialog>
        );
    }
}

export default withAuthorization()(FormButton);
