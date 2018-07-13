import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    type: 'light',
    action: {
        active: '#42c0fb',
    },
};

const theme = createMuiTheme({
    palette,
});

export default theme;
