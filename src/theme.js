import { red, blueGrey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    primary: {
        main: red[500],
    },
    secondary: {
        main: blueGrey[500],
    },
};

const theme = createMuiTheme({
    palette,
});

export default theme;
