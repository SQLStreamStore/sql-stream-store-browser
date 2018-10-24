import { TextField } from '@material-ui/core';
import React, { PureComponent, StatelessComponent } from 'react';
import uriTemplate from 'uri-template';
import { HalLink, NavigatableProps } from '../../types';
import { preventDefault } from '../../utils';
import { withNavigation } from '../NavigationProvider';
import Dialog from './Dialog';
import RelButton from './RelButton';

interface LinkButtonProps {
    readonly rel: string;
    readonly link: HalLink;
}

interface TemplatedLinkButtonProps extends LinkButtonProps {
    readonly curies: HalLink[];
}

const TemplatedLinkButton: StatelessComponent<
    TemplatedLinkButtonProps
> = withNavigation()(
    class extends PureComponent<
        TemplatedLinkButtonProps & NavigatableProps,
        { [variable: string]: string }
    > {
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

interface NonTemplatedLinkButtonProps extends LinkButtonProps {
    readonly title: string;
}

const NonTemplatedLinkButton: StatelessComponent<
    NonTemplatedLinkButtonProps
> = withNavigation()(
    ({
        link,
        rel,
        authorization,
        onNavigate,
    }: NonTemplatedLinkButtonProps & NavigatableProps) => (
        <RelButton
            rel={rel}
            title={link.title}
            color={'inherit'}
            onClick={preventDefault(() => onNavigate(link, authorization))}
        />
    ),
);

export default ({
    link,
    ...props
}: TemplatedLinkButtonProps | NonTemplatedLinkButtonProps) =>
    link.templated === true ? (
        <TemplatedLinkButton
            link={link}
            {...props as TemplatedLinkButtonProps}
        />
    ) : (
        <NonTemplatedLinkButton
            link={link}
            {...props as NonTemplatedLinkButtonProps}
        />
    );
