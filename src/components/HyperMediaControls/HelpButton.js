import React, { PureComponent } from 'react';
import { Button, Drawer, withStyles } from '@material-ui/core';
import uriTemplate from 'uri-template';
import { Help } from '../Icons';
import { withAuthorization } from '../AuthorizationProvider';
import { http } from '../../utils';

const getCurie = (rel, curies) => {
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

const Documentation = withStyles({
    drawerPaper: {
        width: 480,
    },
})(({ open, children, onClose, classes }) => (
    <Drawer
        open={open}
        onClose={onClose}
        anchor={'right'}
        classes={{
            paper: classes.drawerPaper,
        }}
    >
        {children}
    </Drawer>
));

class HelpButton extends PureComponent {
    state = {
        open: false,
        href: null,
        type: null,
        disabled: true,
        documentation: null,
    };

    static getDerivedStateFromProps = ({ rel, curies }, state) => ({
        ...state,
        disabled: false,
        ...getCurie(rel, curies),
    });

    _handleOnClick = async () => {
        const { authorization } = this.props;
        const { href, type } = this.state;
        const { body: documentation } = await http.get({
            link: { href, type },
            headers: { authorization },
        });

        this.setState({
            ...this.state,
            open: true,
            documentation:
                typeof documentation === 'string'
                    ? documentation
                    : JSON.stringify(documentation),
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
