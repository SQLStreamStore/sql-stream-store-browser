import { 
    red100, red500, red700,
    blueGrey500,
    grey400, grey600, grey900, 
    white, fullBlack
 } from '@material-ui/core/styles';
 import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    primary1Color: red700,
    primary2Color: red500,
    primary3Color: red100,
    accent1Color: blueGrey500,
    textColor: grey900,
    //alternateTextColor: grey600,
    canvasColor: white,
    borderColor: grey400,
    shadowColor: fullBlack
};

const theme = createMuiTheme({
    palette
});

export default theme;