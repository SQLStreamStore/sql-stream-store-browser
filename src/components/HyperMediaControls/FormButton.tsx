import React, { FormEvent, PureComponent } from 'react';
import { SchemaForm } from 'react-schema-form';
import { HalLink, NavigatableProps } from '../../types';
import { withAuthorization } from '../AuthorizationProvider';
import Dialog from './Dialog';
import TextAreaField from './TextAreaField';
import UuidField from './UuidField';

const mapper = {
    textarea: TextAreaField,
    uuid: UuidField,
};

const getValue = (value: FormEvent<HTMLInputElement>) => {
    if (typeof value === 'object') {
        try {
            return JSON.parse(value.currentTarget.value);
        } catch (e) {
            return value.currentTarget.value;
        }
    }

    return value;
};

interface FormButtonProps {
    rel: string;
    link: HalLink;
    actions;
    curies: HalLink[];
    schema;
    title: string;
}

interface FormButtonState {
    model: {
        [key: string]: any;
    };
}

class FormButton extends PureComponent<
    FormButtonProps & NavigatableProps,
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
                [key]: getValue(value),
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
