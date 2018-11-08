import {
    Table,
    TableBody,
    TableCell as MaterialTableCell,
    TableFooter,
    TableHead,
    TableRow as MaterialTableRow,
    Theme,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { TableProps } from '@material-ui/core/Table';
import { TableRowProps } from '@material-ui/core/TableRow';
import React, {PureComponent} from 'react';

const TableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
}))(MaterialTableCell);

const tableRowStyles = (theme: Theme) => ({
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

class StripeyTable extends PureComponent<TableProps> {
    static Body = TableBody;
    static Row = TableRow;
    static Cell = TableCell;
    static Head = TableHead;
    static Footer = TableFooter;

    render() {
        return (<Table {...this.props} />)
    }
}

export default StripeyTable;