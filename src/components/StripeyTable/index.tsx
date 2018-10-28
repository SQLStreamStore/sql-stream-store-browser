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
import { TableCellProps } from '@material-ui/core/TableCell';
import { TableRowProps } from '@material-ui/core/TableRow';
import React, { ComponentType } from 'react';

const TableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
}))(MaterialTableCell) as ComponentType<TableCellProps>;

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
) as ComponentType<TableRowProps>;

export { Table, TableBody, TableHead, TableCell, TableRow, TableFooter };
