import {
    Table,
    TableBody,
    TableCell as MaterialTableCell,
    TableFooter,
    TableHead,
    TableRow as MaterialTableRow,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { TableRowProps } from '@material-ui/core/TableRow';
import React from 'react';

const TableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
}))(MaterialTableCell);

const tableRowStyles = theme => ({
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.paper,
        },
    },
});

const TableRow = withStyles(tableRowStyles)(
    ({
        classes,
        ...props
    }: TableRowProps & WithStyles<typeof tableRowStyles>) => (
        <MaterialTableRow {...props} className={classes.row} />
    ),
);

export { Table, TableBody, TableHead, TableCell, TableRow, TableFooter };
