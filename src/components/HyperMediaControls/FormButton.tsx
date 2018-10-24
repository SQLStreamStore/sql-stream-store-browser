import React, { PureComponent } from 'react';
import { SchemaForm } from 'react-schema-form';
import { withAuthorization } from '../AuthorizationProvider';
import Dialog from './Dialog';
import UuidField from './UuidField';
import TextAreaField from './TextAreaField';
import { HalLink, NavigatableProps } from '../../types';

const mapper = {
    uuid: UuidField,
    textarea: TextAreaField,
};

const getValue = value => {
    if (typeof value === 'object') {
        try {
            return JSON.parse(value.target.value);
        } catch (e) {
            return value.target.value;
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
                link,
                headers: {
                    authorization,
                },
            });
        }
    };

    _onModelChange = (key, value) => {
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
        const { schema, rel, title, curies } = this.props;
        const { model } = this.state;
        return (
            <Dialog
                label={title}
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
