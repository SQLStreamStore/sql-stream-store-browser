import React, { PureComponent } from 'react';
import { TextField } from '@material-ui/core';
import uriTemplate from 'uri-template';
import { withAuthorization } from '../AuthorizationProvider';
import Dialog from './Dialog';
import RelButton from './RelButton';
import { preventDefault } from '../../utils';

const TemplatedLinkButton = withAuthorization()(
    class TemplatedLinkButton extends PureComponent {
        state = {};

        _onChange = variable => ({ target }) =>
            this.setState({
                ...this.state,
                [variable]: target.value,
            });

        render() {
            const { rel, link, authorization, onNavigate } = this.props;

            const template = uriTemplate.parse(decodeURI(link.href));

            return (
                <Dialog
                    label={link.title}
                    rel={rel}
                    title={link.title}
                    onSubmit={() =>
                        onNavigate(template.expand(this.state), authorization)
                    }
                >
                    {template.expressions
                        .flatMap(({ params }) => params)
                        .map(({ name }) => (
                            <TextField
                                key={name}
                                label={name}
                                onChange={this._onChange(name)}
                            />
                        ))}
                </Dialog>
            );
        }
    },
);

const NonTemplatedLinkButton = withAuthorization()(
    ({ link, rel, authorization, onNavigate }) => (
        <RelButton
            rel={rel}
            title={link.title}
            color={'action'}
            onClick={preventDefault(() => onNavigate(link.href, authorization))}
        />
    ),
);

export default ({ link, ...props }) =>
    link.templated === true ? (
        <TemplatedLinkButton link={link} {...props} />
    ) : (
        <NonTemplatedLinkButton link={link} {...props} />
    );
