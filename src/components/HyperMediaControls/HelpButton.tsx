import {
    Button,
    Drawer,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import React, { PureComponent, ReactNode } from 'react';
import Remarkable from 'react-remarkable';
import uriTemplate from 'uri-template';
import { HalLink } from '../../types';
import { http } from '../../utils';
import { withAuthorization } from '../AuthorizationProvider';
import { Help } from '../Icons';

const getCurie = (rel: string, curies: HalLink[]): HalLink => {
    const [prefix, rest] = rel.split(':', 2);

    return !rest || rest.indexOf(':') !== -1
        ? { href: rel }
        : curies
              .filter(({ name }) => name === prefix)
              .map(({ href, ...link }) => ({
                  ...link,
                  href: uriTemplate
                      .parse(decodeURI(href))
                      .expand({ rel: rest }),
              }))[0] || { href: rel };
};

interface DocumentationProps {
    readonly open: boolean;
    readonly onClose: () => void;
}

const Documentation = withStyles(theme => ({
    drawerPaper: {
        padding: theme.spacing.unit * 2,
        width: '45%',
    },
}))(
    ({
        open,
        children,
        onClose,
        classes,
    }: DocumentationProps & WithStyles & { children: ReactNode }) => (
        <Drawer
            open={open}
            onClose={onClose}
            anchor={'right'}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Typography>
                <Remarkable
                    options={{
                        typographer: true,
                    }}
                >
                    {children}
                </Remarkable>
            </Typography>
        </Drawer>
    ),
);

interface HelpButtonProps {
    rel: string;
    curies: HalLink[];
    disabled?: boolean;
    authorization?: string;
}

interface HelpButtonState extends HalLink {
    open: boolean;
    documentation: string;
    disabled: boolean;
}

class HelpButton extends PureComponent<HelpButtonProps, HelpButtonState> {
    static getDerivedStateFromProps = (
        { rel, curies }: HelpButtonProps,
        state: HelpButtonState,
    ): HelpButtonState => ({
        ...state,
        disabled: false,
        ...getCurie(rel, curies),
    });
    state = {
        curies: [],
        disabled: true,
        documentation: '',
        href: '',
        open: false,
        type: '',
    };

    _handleOnClick = async () => {
        const { authorization } = this.props;
        const { href, type } = this.state;
        const { body: documentation } = await http.get({
            headers: { authorization },
            link: { href, type },
        });

        this.setState({
            ...this.state,
            documentation:
                typeof documentation === 'string'
                    ? documentation
                    : JSON.stringify(documentation),
            open: true,
        });
    };

    _handleOnClose = () => this.setState({ open: false });

    render() {
        const { disabled } = this.props;
        const { documentation, open } = this.state;

        return (
            <Button
                color={'secondary'}
                disabled={disabled}
                onClick={this._handleOnClick}
            >
                <Documentation onClose={this._handleOnClose} open={open}>
                    {documentation}
                </Documentation>
                <Help />
                {'Help'}
            </Button>
        );
    }
}

export default withAuthorization()(HelpButton);
