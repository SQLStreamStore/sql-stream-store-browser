import { TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import {
    ComposedComponent,
    ReactSchemaFormInputProps,
} from 'react-schema-form';

const getDisplayValue = (value: object | string): string =>
    typeof value === 'string' ? value : JSON.stringify(value);

class TextAreaField extends React.PureComponent<
    ReactSchemaFormInputProps<HTMLTextAreaElement>
> {
    constructor(props: ReactSchemaFormInputProps<HTMLTextAreaElement>) {
        super(props);
    }

    _onChangeValidate = (
        e: ChangeEvent<HTMLTextAreaElement>,
        v?: any,
    ): void => {
        const { form, onChangeValidate } = this.props;

        const tryParseJson = (value: string): string | object | undefined => {
            if (!value) {
                return undefined;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };

        onChangeValidate(
            {
                ...e,
                currentTarget: {
                    ...e.currentTarget,
                    // @ts-ignore
                    value:
                        form.schema.type === 'object'
                            ? tryParseJson(e.target.value)
                            : e.target.value,
                },
                target: {
                    // @ts-ignore
                    value:
                        form.schema.type === 'object'
                            ? tryParseJson(e.target.value)
                            : e.target.value,
                },
            },
            v,
        );
    };

    render() {
        const { form, error, value } = this.props;

        return (
            <div className={form.htmlClass}>
                <TextField
                    type={form.type}
                    label={form.title}
                    placeholder={form.placeholder}
                    helperText={error || form.description}
                    error={!!error}
                    onChange={this._onChangeValidate}
                    value={getDisplayValue(value)}
                    disabled={form.readonly}
                    fullWidth
                    multiline
                    rows={15}
                    rowsMax={15}
                />
            </div>
        );
    }
}

export default ComposedComponent(TextAreaField);
