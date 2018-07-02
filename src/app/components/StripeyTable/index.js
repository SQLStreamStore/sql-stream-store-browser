import React from 'react';
import {
    Table,
    TableBody,
    TableRow as MaterialTableRow,
    TableCell as MaterialTableCell,
    TableHead,
    TableFooter,
    withStyles,
} from '@material-ui/core';

const TableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
}))(MaterialTableCell);

const TableRow = withStyles(theme => ({
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.paper,
        },
    },
}))(({ classes, ...props }) => (
    <MaterialTableRow
        {...props}
        className={classes.row}
    />));

export {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableFooter,
};
