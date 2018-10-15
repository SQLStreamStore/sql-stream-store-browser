import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    type: 'light',
    action: {
        active: '#42c0fb',
    },
};

const typography = {
    useNextVariants: true,
};

const theme = createMuiTheme({
    palette,
    typography,
});

export default theme;
