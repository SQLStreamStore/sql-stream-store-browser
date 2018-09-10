import React, { PureComponent } from 'react';
import { SchemaForm } from 'react-schema-form';
import { withAuthorization } from '../AuthorizationProvider';
import Dialog from './Dialog';
import UuidField from './UuidField';

const mapper = {
    uuid: UuidField,
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

class FormButton extends PureComponent {
    state = {};
    _onSubmit = () => {
        const { rel, url, actions, authorization } = this.props;
        const { model: body } = this.state;

        if (actions[rel]) {
            actions[rel].request.next({
                body,
                url,
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
        const { schema, rel, title } = this.props;
        const { model } = this.state;
        return (
            <Dialog
                label={title}
                rel={rel}
                title={schema.title}
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
