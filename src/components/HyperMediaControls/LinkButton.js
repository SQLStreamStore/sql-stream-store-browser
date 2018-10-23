import React, { PureComponent } from 'react';
import { TextField } from '@material-ui/core';
import uriTemplate from 'uri-template';
import { withNavigation } from '../NavigationProvider';
import Dialog from './Dialog';
import RelButton from './RelButton';
import { preventDefault } from '../../utils';

const TemplatedLinkButton = withNavigation()(
    class TemplatedLinkButton extends PureComponent {
        state = {};

        _onChange = variable => ({ target }) =>
            this.setState({
                ...this.state,
                [variable]: target.value,
            });

        render() {
            const { rel, link, authorization, onNavigate, curies } = this.props;

            const template = uriTemplate.parse(decodeURI(link.href));

            return (
                <Dialog
                    label={link.title}
                    rel={rel}
                    title={link.title}
                    curies={curies}
                    onSubmit={() =>
                        onNavigate(
                            { ...link, href: template.expand(this.state) },
                            authorization,
                        )
                    }
                >
                    {template.expressions
                        .flatMap(({ params }) => params)
                        .map(({ name }) => (
                            <TextField
                                key={name}
                                label={name}
                                onChange={this._onChange(name)}
                                fullWidth
                            />
                        ))}
                </Dialog>
            );
        }
    },
);

const NonTemplatedLinkButton = withNavigation()(
    ({ link, rel, authorization, onNavigate }) => (
        <RelButton
            rel={rel}
            title={link.title}
            color={'action'}
            onClick={preventDefault(() => onNavigate(link, authorization))}
        />
    ),
);

export default ({ link, ...props }) =>
    link.templated === true ? (
        <TemplatedLinkButton link={link} {...props} />
    ) : (
        <NonTemplatedLinkButton link={link} {...props} />
    );
