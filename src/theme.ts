import { createMuiTheme } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const palette: PaletteOptions = {
    action: {
        active: '#42c0fb',
    },
    type: 'light',
};

const typography = {
    useNextVariants: true,
};

const theme = createMuiTheme({
    palette,
    typography,
});

export default theme;
