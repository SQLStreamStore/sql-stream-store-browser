import React from 'react';
import {
    Table,
    TableBody,
    TableRow as _TableRow,
    TableCell as _TableCell,
    TableHead,
    TableFooter,
    withStyles
} from '@material-ui/core';

const TableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white
    }
}))(_TableCell);

const TableRow = withStyles(theme => ({
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.paper,
        },
    }
}))(({ classes, ...props }) => (
    <_TableRow
        {...props}
        className={classes.row}
    />));

export {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableFooter
};